import AiBehavior from './ai-behavior';
import AiPromotionBehavior from './ai-promotion-behavior';
import { IMAGE_PROMPT_CATEGORIES } from './pages/form-media/constants';

export default class Module extends elementorModules.editor.utils.Module {
	onElementorInit() {
		elementor.hooks.addFilter( 'controls/base/behaviors', this.registerControlBehavior );
	}

	registerControlBehavior( behaviors, view ) {
		const aiOptions = view.options.model.get( 'ai' );

		if ( ! aiOptions?.active ) {
			return behaviors;
		}

		const controlType = view.options.model.get( 'type' );
		const textControls = [ 'text', 'textarea' ];

		if ( textControls.includes( aiOptions.type ) ) {
			behaviors.ai = {
				behaviorClass: AiBehavior,
				controlType,
				type: aiOptions.type,
				getControlValue: view.getControlValue.bind( view ),
				setControlValue: ( value ) => {
					if ( 'wysiwyg' === controlType ) {
						value = value.replaceAll( '\n', '<br>' );
					}

					view.setSettingsModel( value );
					view.applySavedValue();
				},
				isLabelBlock: view.options.model.get( 'label_block' ),
				additionalOptions: {
					defaultValue: view.options.model.get( 'default' ),
				},
				context: {
					documentType: view.options.container.document.config.type,
					elementType: view.options.container.args.model.get( 'elType' ),
					elementId: view.options.container.id,
					widgetType: view.options.container.args.model.get( 'widgetType' ),
					controlName: view.options.model.get( 'name' ),
					controlType,
				},
			};
		}

		const codeControls = [ 'code' ];
		if ( codeControls.includes( aiOptions.type ) ) {
			const htmlMarkup = view.options?.container?.view?.$el ? view.options.container.view.$el[ 0 ].outerHTML : '';

			behaviors.ai = {
				behaviorClass: AiBehavior,
				type: aiOptions.type,
				additionalOptions: {
					codeLanguage: aiOptions?.language || view.options.model.get( 'language' ),
					htmlMarkup,
					elementId: view.options.container.id,
				},
				buttonLabel: __( 'Code with AI', 'elementor' ),
				isLabelBlock: view.options.model.get( 'label_block' ),
				getControlValue: view.getControlValue.bind( view ),
				setControlValue: ( value ) => view.editor.setValue( value, -1 ),
				context: {
					documentType: view.options.container.document.config.type,
					elementType: view.options.container.args.model.get( 'elType' ),
					elementId: view.options.container.id,
					widgetType: view.options.container.args.model.get( 'widgetType' ),
					controlName: view.options.model.get( 'name' ),
					controlType,
				},
			};
		}

		const mediaControl = [ 'media' ];
		if ( mediaControl.includes( aiOptions.type ) ) {
			const mediaTypes = view.options.model.get( 'media_types' );

			if ( mediaTypes.length && mediaTypes.includes( 'image' ) ) {
				behaviors.ai = {
					behaviorClass: AiBehavior,
					type: aiOptions.type,
					buttonLabel: __( 'Create with AI', 'elementor' ),
					getControlValue: view.getControlValue.bind( view ),
					setControlValue: ( value ) => {},
					controlView: view,
					additionalOptions: {
						defaultValue: view.options.model.get( 'default' ),
						defaultImageType: aiOptions?.category || IMAGE_PROMPT_CATEGORIES[ 1 ].key,
					},
					context: {
						documentType: view.options.container.document.config.type,
						elementType: view.options.container.args.model.get( 'elType' ),
						elementId: view.options.container.id,
						widgetType: view.options.container.args.model.get( 'widgetType' ),
						controlName: view.options.model.get( 'name' ),
						controlType,
					},
				};
			}
		}

		return behaviors;
	}
}
