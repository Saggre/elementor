import { test, expect } from '@playwright/test';
import WpAdminPage from '../../../pages/wp-admin-page.js';
const EditorPage = require( '../../../pages/editor-page.js' );
import GoogleMaps from '../../../pages/widgets/google-maps.js';

test( 'Verify Google maps controls', async ( { page }, testInfo ) => {
	const wpAdmin = new WpAdminPage( page, testInfo );
	const editor = new EditorPage( page, testInfo );
	const googleMapsWidget = new GoogleMaps( page, testInfo );
	const height = 600;
	const zoom = '12';
	const location = 'New York';

	await wpAdmin.openNewPage();
	await editor.closeNavigatorIfOpen();
	await editor.addWidget( 'google_maps' );
	await googleMapsWidget.setGoogleMapsParams( { location, zoom, height } );
	let src = await googleMapsWidget.getSrc();
	const expectedValues = {
		q: 'New%20York',
		t: 'm',
		z: zoom,
		output: 'embed',
		iwloc: 'near',
	};
	let currentHeight = await googleMapsWidget.getHeight();
	expect( currentHeight ).toEqual( height );
	googleMapsWidget.verifySrcParams( src, expectedValues, 'google-maps' );

	await editor.publishAndViewPage();

	src = await googleMapsWidget.getSrc( true );
	googleMapsWidget.verifySrcParams( src, expectedValues, 'google-maps' );
	currentHeight = await googleMapsWidget.getHeight( true );
	expect( currentHeight ).toEqual( height );
} );

