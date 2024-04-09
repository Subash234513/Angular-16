import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

@Injectable({
  providedIn: 'root'
})
export class PdfgeneratorService {

  constructor() { }

  async generatePDFFromHTMLById(htmlId: string, filename: string) {
    const pdf = new jsPDF();
    
    const divToConvert = document.getElementById(htmlId);
    if (!divToConvert) {
      console.error(`Element with id "${htmlId}" not found.`);
      return;
    }
    
    const canvas = await html2canvas(divToConvert, { scrollY: -window.scrollY , scrollX: -window.scrollX });
    const imageData = canvas.toDataURL('image/jpeg');
    pdf.addImage(imageData, 'JPEG', 15, 15, 180, 0);
    pdf.save(filename + '.pdf');
  }
}
