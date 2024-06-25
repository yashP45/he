import { Request, Response } from 'express';
import Invoice, { IInvoice } from '../models/invoice';
import Product, { IProduct } from '../models/product';
import puppeteer from 'puppeteer';

export const generatePDF = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user.id;

  try {
    const products: IProduct[] = await Product.find({ userId });
    const invoice: IInvoice = new Invoice({ userId, products: products.map(p => p._id) });
    await invoice.save();

    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox' ,  '--disable-dev-shm-usage']
    });
    const page = await browser.newPage();

    let total = 0;
    const productDetails = products.map(product => {
      const subTotal = product.quantity * product.rate;
      total += subTotal;
      return `<tr>
        <td>${product.name}</td>
        <td>${product.quantity}</td>
        <td>${product.rate}</td>
        <td>${subTotal}</td>
      </tr>`;
    });

    const gst = total * 0.18;
    const grandTotal = total + gst;

    const htmlContent = `
      <h1>Invoice</h1>
      <table border="1">
        <tr>
          <th>Product Name</th>
          <th>Quantity</th>
          <th>Rate</th>
          <th>Total</th>
        </tr>
        ${productDetails.join('')}
        <tr>
          <td colspan="3">GST (18%)</td>
          <td>${gst.toFixed(2)}</td>
        </tr>
        <tr>
          <td colspan="3">Grand Total</td>
          <td>${grandTotal.toFixed(2)}</td>
        </tr>
      </table>
    `;

    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    const pdfBuffer = await page.pdf();

    await browser.close();

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Length': pdfBuffer.length
    });

    res.send(pdfBuffer);
  } catch (err) {
    console.error('Error generating PDF:', err);
    res.status(500).send({ message: 'Error generating PDF', error: err });
  }
};
