import { Component, OnDestroy } from '@angular/core';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnDestroy {

  qrCodeString = 'This is a secret qr code message';
  scannedResult: any;

  constructor() { }

  async checkPermission() {
    try {
      const status = await BarcodeScanner.checkPermission({ force: true });
      if (status.granted) {
        return true;
      }
      return false;
    } catch (e) {
      console.log(e)
      return false;
    }
  }

  async startScan() {
    try {
      const permission = await this.checkPermission();
      if (!permission) {
        return;
      }
      await BarcodeScanner.hideBackground();
      let scanner = document.querySelector('body')
      if (scanner !== null) {
        scanner.classList.add('scanner-active');
      }
      const result = await BarcodeScanner.startScan();
      console.log(result)

      if (result?.hasContent) {
        this.scannedResult = result.content;
        if (scanner !== null) {
          scanner.classList.remove('scanner-active');
        }
        console.log(this.scannedResult)
      }
    } catch (e) {
      console.log(e);
      this.stopScan();
    }

  }

  stopScan() {
    BarcodeScanner.showBackground();
    BarcodeScanner.stopScan();
    let scanner = document.querySelector('body')
    if (scanner !== null) {
      scanner.classList.remove('scanner-active');
    }
  }

ngOnDestroy(): void {
  this.stopScan()
}

}
