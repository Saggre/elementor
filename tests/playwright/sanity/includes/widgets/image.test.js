const { test, expect } = require( '@playwright/test' );
const WpAdminPage = require( '../../../pages/wp-admin-page.js' );
const EditorPage = require( '../../../pages/editor-page.js' );
import EditorSelectors from '../../../selectors/editor-selectors.js';
import Content from '../../../pages/elementor-panel-tabs/content.js';

test.describe( 'Image widget tests @styleguide_image_link', () => {
	const data = [
		{
			widgetTitle: 'image',
			image: EditorSelectors.image.image,
			widget: EditorSelectors.image.widget,
			select: EditorSelectors.image.imageSizeSelect,
			isVideo: false,
		},
		{
			widgetTitle: 'image-box',
			image: EditorSelectors.imageBox.image,
			widget: EditorSelectors.imageBox.widget,
			select: EditorSelectors.imageBox.imageSizeSelect,
			isVideo: false,
		},
	];

	for ( const i in data ) {
		test( `${ data[ i ].widgetTitle }: Image size test`, async ( { page }, testInfo ) => {
			const wpAdmin = new WpAdminPage( page, testInfo );
			const editor = new EditorPage( page, testInfo );
			const contentTab = new Content( page, testInfo );
			const imageTitle = 'About-Pic-3-1';

			await wpAdmin.openNewPage();
			await editor.addWidget( data[ i ].widgetTitle );
			await contentTab.chooseImage( `${ imageTitle }.png` );

			const imageSize = [ 'thumbnail', 'large', 'full' ];
			for ( const id in imageSize ) {
				await wpAdmin.waitForPanel();
				await contentTab.selectImageSize(
					{
						widget: data[ i ].widget,
						select: data[ i ].select,
						imageSize: imageSize[ id ],
					} );
				await contentTab.verifyImageSrc(
					{
						selector: data[ i ].image,
						isPublished: false,
						isVideo: data[ i ].isVideo,
					} );
				await editor.verifyClassInElement(
					{
						selector: data[ i ].image,
						className: `size-${ imageSize[ id ] }`,
						isPublished: false,
					} );
				await editor.publishAndViewPage();
				await wpAdmin.waitForPanel();
				await contentTab.verifyImageSrc(
					{
						selector: data[ i ].image,
						isPublished: true,
						isVideo: data[ i ].isVideo,
					} );
				await editor.verifyClassInElement(
					{
						selector: data[ i ].image,
						className: `size-${ imageSize[ id ] }`,
						isPublished: true,
					} );
				await wpAdmin.editWithElementor();
			}
		} );
	}

	for ( const i in data ) {
		test( `${ data[ i ].widgetTitle }: Custom image size test`, async ( { page }, testInfo ) => {
			const wpAdmin = new WpAdminPage( page, testInfo );
			const editor = new EditorPage( page, testInfo );
			const contentTab = new Content( page, testInfo );
			const imageTitle = 'About-Pic-3-1';

			await wpAdmin.openNewPage();
			await editor.addWidget( data[ i ].widgetTitle );
			await contentTab.chooseImage( `${ imageTitle }.png` );
			await contentTab.setCustomImageSize(
				{
					selector: data[ i ].image,
					select: data[ i ].select,
					imageTitle, width: '300', height: '300',
				} );
			await editor.verifyImageSize( { selector: data[ i ].image, width: 300, height: 300, isPublished: false } );
			await editor.publishAndViewPage();
			await editor.verifyImageSize( { selector: data[ i ].image, width: 300, height: 300, isPublished: true } );
		} );
	}

	test( 'Lightbox image captions aligned center', async ( { page }, testInfo ) => {
		const wpAdmin = new WpAdminPage( page, testInfo );
		const editor = new EditorPage( page, testInfo );
		const contentTab = new Content( page, testInfo );
		const image = 'About-Pic-3-1';

		await wpAdmin.openNewPage();
		await editor.closeNavigatorIfOpen();
		await editor.addWidget( 'image' );
		await contentTab.chooseImage( `${ image }.png` );
		await contentTab.setCaption( 'attachment' );
		await contentTab.selectLinkSource( 'file' );
		await contentTab.setLightBox( 'yes' );
		expect( await editor.getPreviewFrame().locator( EditorSelectors.image.link ).
			getAttribute( 'data-elementor-open-lightbox' ) ).toEqual( 'yes' );
		await editor.getPreviewFrame().locator( EditorSelectors.image.image ).click( );
		await expect( editor.getPreviewFrame().locator( EditorSelectors.image.lightBox ) ).toBeVisible();

		const title = editor.getPreviewFrame().locator( '.elementor-slideshow__title' );
		const description = editor.getPreviewFrame().locator( '.elementor-slideshow__description' );
		await expect( title ).toHaveCSS( 'text-align', 'center' );
		await expect( description ).toHaveCSS( 'text-align', 'center' );
	} );
} );
