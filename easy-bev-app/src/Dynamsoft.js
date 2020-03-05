import Dynamsoft from "dynamsoft-javascript-barcode";
Dynamsoft.BarcodeReader.engineResourcePath = "https://cdn.jsdelivr.net/npm/dynamsoft-javascript-barcode@7.3.0-v2/dist/";
// Please visit https://www.dynamsoft.com/CustomerPortal/Portal/TrialLicense.aspx to get a trial license
Dynamsoft.BarcodeReader.productKeys = "t0068MgAAAFr1UyQUdNpQLH1AB4cDc/sUxwTM9ZxzyQSfsJb23SOS4VagPBFzOzKZItNS4PXM8t8FTVyS01mU5Fjg96ZW7Eo=";
// Dynamsoft.BarcodeReader._bUseFullFeature = true; // Control of loading min wasm or full wasm.
export default Dynamsoft;
