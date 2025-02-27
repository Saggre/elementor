<?php
namespace Elementor\Core\Editor\Loader\V2;

use Elementor\Core\Editor\Loader\Common\Editor_Common_Scripts_Settings;
use Elementor\Core\Editor\Loader\Editor_Base_Loader;
use Elementor\Utils;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

class Editor_V2_Loader extends Editor_Base_Loader {
	const APP_PACKAGE = 'editor';
	const ENV_PACKAGE = 'env';

	/**
	 * Packages that should be enqueued (the main app and the extensions of the app).
	 */
	const PACKAGES_TO_ENQUEUE = [
		// App
		self::APP_PACKAGE,

		// Extensions
		'editor-app-bar',
		'editor-documents',
		'editor-panels',
		'editor-responsive',
		'editor-site-navigation',
		'editor-v1-adapters',
	];

	/**
	 * Packages that should only be registered, unless some other asset depends on them.
	 */
	const LIBS = [
		self::ENV_PACKAGE,
		'icons',
		'locations',
		'store',
		'ui',
	];

	/**
	 * @return void
	 */
	public function init() {
		$packages = array_merge( self::PACKAGES_TO_ENQUEUE, self::LIBS );

		foreach ( $packages as $package ) {
			$this->assets_config_provider->load( $package );
		}

		do_action( 'elementor/editor/v2/init' );
	}

	/**
	 * @return void
	 */
	public function register_scripts() {
		parent::register_scripts();

		$assets_url = $this->config->get( 'assets_url' );
		$min_suffix = $this->config->get( 'min_suffix' );

		foreach ( $this->assets_config_provider->all() as $package => $config ) {
			if ( self::ENV_PACKAGE === $package ) {
				wp_register_script(
					'elementor-editor-environment-v2',
					"{$assets_url}js/editor-environment-v2{$min_suffix}.js",
					[ $config['handle'] ],
					ELEMENTOR_VERSION,
					true
				);
			}

			if ( static::APP_PACKAGE === $package ) {
				wp_register_script(
					'elementor-editor-loader-v2',
					"{$assets_url}js/editor-loader-v2{$min_suffix}.js",
					[ 'elementor-editor', $config['handle'] ],
					ELEMENTOR_VERSION,
					true
				);
			}

			wp_register_script(
				$config['handle'],
				"{$assets_url}js/packages/{$package}/{$package}{$min_suffix}.js",
				$config['deps'],
				ELEMENTOR_VERSION,
				true
			);

			wp_set_script_translations( $config['handle'], 'elementor' );
		}

		do_action( 'elementor/editor/v2/scripts/register' );
	}

	/**
	 * @return void
	 */
	public function enqueue_scripts() {
		do_action( 'elementor/editor/v2/scripts/enqueue/before' );

		wp_enqueue_script( 'elementor-editor-environment-v2' );

		foreach ( $this->assets_config_provider->only( self::PACKAGES_TO_ENQUEUE ) as $config ) {
			if ( self::ENV_PACKAGE === $config['handle'] ) {
				$client_env = apply_filters( 'elementor/editor/v2/scripts/env', [] );

				Utils::print_js_config(
					$config['handle'],
					'elementorEditorV2Env',
					$client_env
				);
			}

			wp_enqueue_script( $config['handle'] );
		}

		do_action( 'elementor/editor/v2/scripts/enqueue' );

		Utils::print_js_config(
			'elementor-editor',
			'ElementorConfig',
			Editor_Common_Scripts_Settings::get()
		);

		// Must be last.
		wp_enqueue_script( 'elementor-editor-loader-v2' );

		do_action( 'elementor/editor/v2/scripts/enqueue/after' );
	}

	/**
	 * @return void
	 */
	public function register_styles() {
		parent::register_styles();

		$assets_url = $this->config->get( 'assets_url' );
		$min_suffix = $this->config->get( 'min_suffix' );

		wp_register_style(
			'elementor-editor-v2-overrides',
			"{$assets_url}css/editor-v2-overrides{$min_suffix}.css",
			[ 'elementor-editor' ],
			ELEMENTOR_VERSION
		);

		do_action( 'elementor/editor/v2/styles/register' );
	}

	/**
	 * @return void
	 */
	public function enqueue_styles() {
		parent::enqueue_styles();

		wp_enqueue_style( 'elementor-editor-v2-overrides' );

		do_action( 'elementor/editor/v2/styles/enqueue' );
	}

	/**
	 * @return void
	 */
	public function print_root_template() {
		// Exposing the path for the view part to render the body of the editor template.
		$body_file_path = __DIR__ . '/templates/editor-body-v2.view.php';

		include ELEMENTOR_PATH . 'includes/editor-templates/editor-wrapper.php';
	}
}
