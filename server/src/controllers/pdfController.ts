import { Request, Response } from "express";
import Invoice, { IInvoice } from "../models/invoice";
import Product, { IProduct } from "../models/product";
import puppeteer from "puppeteer";

export const generatePDF = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = req.user.id;

  try {
    const products: IProduct[] = await Product.find({ userId });
    const invoice: IInvoice = new Invoice({
      userId,
      products: products.map((p) => p._id),
    });
    await invoice.save();

    const browser = await puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
      ],
    });
    const page = await browser.newPage();

    let total = 0;
    const productDetails = products.map((product) => {
      const subTotal = product.quantity * product.rate;
      total += subTotal;
      return `<tr class="item">
        <td>${product.name}</td>
        <td>${product.quantity}</td>
        <td>${product.rate.toFixed(2)}</td>
        <td>${subTotal.toFixed(2)}</td>
      </tr>`;
    });

    const gst = total * 0.18;
    const grandTotal = total + gst;

    const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Invoice</title>
        <style>
          body {
            font-family: 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;
            text-align: center;
            color: #777;
          }
          .invoice-box {
            max-width: 800px;
            margin: auto;
            padding: 30px;
            border: 1px solid #eee;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
            font-size: 16px;
            line-height: 24px;
            font-family: 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;
            color: #555;
          }
          .invoice-box table {
            width: 100%;
            line-height: inherit;
            text-align: left;
            border-collapse: collapse;
          }
          .invoice-box table td {
            padding: 5px;
            vertical-align: top;
          }
          .invoice-box table tr td:nth-child(2) {
            text-align: right;
          }
          .invoice-box table tr.top table td {
            padding-bottom: 20px;
          }
          .invoice-box table tr.top table td.title {
            font-size: 45px;
            line-height: 45px;
            color: #333;
          }
          .invoice-box table tr.information table td {
            padding-bottom: 40px;
          }
          .invoice-box table tr.heading td {
            background: #eee;
            border-bottom: 1px solid #ddd;
            font-weight: bold;
          }
          .invoice-box table tr.details td {
            padding-bottom: 20px;
          }
          .invoice-box table tr.item td {
            border-bottom: 1px solid #eee;
          }
          .invoice-box table tr.item.last td {
            border-bottom: none;
          }
          .invoice-box table tr.total td:nth-child(2) {
            border-top: 2px solid #eee;
            font-weight: bold;
          }
          @media only screen and (max-width: 600px) {
            .invoice-box table tr.top table td,
            .invoice-box table tr.information table td {
              width: 100%;
              display: block;
              text-align: center;
            }
          }
        </style>
      </head>
      <body>
        <div class="invoice-box">
          <table>
            <tr class="top">
              <td colspan="4">
                <table>
                  <tr>
                    <td class="title">
                      <img src="https://img.freepik.com/free-vector/figure-folded-logo_1043-97.jpg?size=338&ext=jpg&ga=GA1.1.1141335507.1719187200&semt=ais_user" style="width: 100%; max-width: 300px;" />
                    </td>
                    <td>
                      Invoice #: ${invoice._id}<br />
                      Created: ${new Date().toLocaleDateString()}<br />
                      Due: ${new Date(
                        new Date().setDate(new Date().getDate() + 30)
                      ).toLocaleDateString()}
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr class="information">
              <td colspan="4">
                <table>
                  <tr>
                    <td>
                      Your Company, Inc.<br />
                      12345 Sunny Road<br />
                      Sunnyville, TX 12345
                    </td>
                    <td>
                      ${req.user.name}<br />
                      ${req.user.email}
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr class="heading">
              <td>Product Name</td>
              <td>Quantity</td>
              <td>Rate</td>
              <td>Total</td>
            </tr>
            ${productDetails.join("")}
            <tr class="total">
              <td></td>
              <td></td>
              <td>GST (18%)</td>
              <td>${gst.toFixed(2)}</td>
            </tr>
            <tr class="total">
              <td></td>
              <td></td>
              <td>Grand Total</td>
              <td>${grandTotal.toFixed(2)}</td>
            </tr>
          </table>
        </div>
      </body>
    </html>
    `;

    await page.setContent(htmlContent, { waitUntil: "networkidle0" });
    const pdfBuffer = await page.pdf();

    await browser.close();

    await Product.deleteMany({ userId });

    res.set({
      "Content-Type": "application/pdf",
      "Content-Length": pdfBuffer.length,
    });

    res.send(pdfBuffer);
  } catch (err) {
    console.error("Error generating PDF:", err);
    res.status(500).send({ message: "Error generating PDF", error: err });
  }
};
