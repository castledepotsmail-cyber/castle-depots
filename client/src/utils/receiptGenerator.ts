interface OrderItem {
    product: {
        name: string;
    };
    quantity: number;
    price: string;
}

interface Order {
    id: string;
    created_at: string;
    status: string;
    payment_method: string;
    delivery_address: string;
    total_amount: string;
    items: OrderItem[];
    user: string;
    is_paid: boolean;
}

export const generateReceipt = async (order: Order, action: 'download' | 'view' = 'download') => {
    // Dynamic imports to avoid SSR issues
    const jsPDF = (await import('jspdf')).default;
    const QRCode = await import('qrcode');

    const pdf = new jsPDF();

    // Generate QR Code
    const qrCodeData = await QRCode.toDataURL(`https://castledepots.co.ke/track-order?id=${order.id}`, {
        width: 100,
        margin: 1,
    });

    // Colors
    const primaryBlue = '#1e40af';
    const goldColor = '#fbbf24';
    const darkGray = '#1f2937';
    const lightGray = '#6b7280';

    // Add Castle Depots Logo (Text-based for now)
    pdf.setFillColor(30, 64, 175); // Brand blue
    pdf.rect(0, 0, 210, 40, 'F');

    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(28);
    pdf.setFont('helvetica', 'bold');
    pdf.text('CASTLE DEPOTS', 105, 18, { align: 'center' });

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Premium Quality Products for Your Lifestyle', 105, 28, { align: 'center' });
    pdf.text('www.castledepots.co.ke | support@castledepots.co.ke', 105, 35, { align: 'center' });

    // Receipt Title
    pdf.setTextColor(30, 64, 175);
    pdf.setFontSize(20);
    pdf.setFont('helvetica', 'bold');
    pdf.text('OFFICIAL RECEIPT', 105, 55, { align: 'center' });

    // Receipt Details Box
    pdf.setDrawColor(200, 200, 200);
    pdf.setLineWidth(0.5);
    pdf.rect(15, 65, 180, 35);

    pdf.setTextColor(31, 41, 55);
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');

    // Left column
    pdf.text('Receipt No:', 20, 73);
    pdf.text('Order Date:', 20, 81);
    pdf.text('Payment Method:', 20, 89);
    pdf.text('Payment Status:', 20, 97);

    pdf.setFont('helvetica', 'normal');
    pdf.text(order.id.slice(0, 13).toUpperCase(), 55, 73);
    pdf.text(new Date(order.created_at).toLocaleDateString('en-GB'), 55, 81);
    pdf.text(order.payment_method.replace('_', ' ').toUpperCase(), 55, 89);

    // Payment status with color
    if (order.is_paid) {
        pdf.setTextColor(22, 163, 74); // Green
        pdf.text('PAID', 55, 97);
    } else {
        pdf.setTextColor(234, 88, 12); // Orange
        pdf.text('UNPAID', 55, 97);
    }

    // Right column
    pdf.setTextColor(31, 41, 55);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Customer:', 115, 73);
    pdf.text('Order Status:', 115, 81);
    pdf.text('Delivery Address:', 115, 89);

    pdf.setFont('helvetica', 'normal');
    pdf.text(order.user || 'N/A', 155, 73);
    pdf.text(order.status.replace('_', ' ').toUpperCase(), 155, 81);

    // Wrap delivery address
    const addressLines = pdf.splitTextToSize(order.delivery_address, 40);
    pdf.text(addressLines, 155, 89);

    // Items Table Header
    let yPos = 115;
    pdf.setFillColor(30, 64, 175);
    pdf.rect(15, yPos, 180, 10, 'F');

    pdf.setTextColor(255, 255, 255);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(10);
    pdf.text('ITEM', 20, yPos + 7);
    pdf.text('QTY', 125, yPos + 7);
    pdf.text('PRICE', 145, yPos + 7);
    pdf.text('TOTAL', 190, yPos + 7, { align: 'right' });

    // Items
    yPos += 15;
    pdf.setTextColor(31, 41, 55);
    pdf.setFont('helvetica', 'normal');

    order.items.forEach((item, index) => {
        const itemTotal = parseFloat(item.price) * item.quantity;

        // Alternate row colors
        if (index % 2 === 0) {
            pdf.setFillColor(249, 250, 251);
            pdf.rect(15, yPos - 5, 180, 10, 'F');
        }

        // Item name (wrapped if too long)
        const itemName = pdf.splitTextToSize(item.product.name, 95);
        pdf.text(itemName, 20, yPos);

        pdf.text(item.quantity.toString(), 125, yPos);
        pdf.text(`KES ${parseFloat(item.price).toLocaleString()}`, 145, yPos);
        pdf.text(`KES ${itemTotal.toLocaleString()}`, 190, yPos, { align: 'right' });

        yPos += 10;
    });

    // Totals Section
    yPos += 5;
    pdf.setLineWidth(0.5);
    pdf.setDrawColor(200, 200, 200);
    pdf.line(15, yPos, 195, yPos);

    yPos += 10;
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(14);
    pdf.text('TOTAL AMOUNT:', 110, yPos);
    pdf.setTextColor(30, 64, 175);
    pdf.setFontSize(16);
    pdf.text(`KES ${parseFloat(order.total_amount).toLocaleString()}`, 195, yPos, { align: 'right' });

    // QR Code
    pdf.addImage(qrCodeData, 'PNG', 20, yPos + 10, 30, 30);

    pdf.setTextColor(107, 114, 128);
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Scan to track order', 20, yPos + 45, { align: 'left' });

    // Thank You Message
    pdf.setTextColor(31, 41, 55);
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Thank you for shopping with Castle Depots!', 105, yPos + 25, { align: 'center' });

    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(107, 114, 128);
    pdf.text('For support, contact us at support@castledepots.co.ke or call +254 700 000 000', 105, yPos + 32, { align: 'center' });

    // Footer
    const footerY = 280;
    pdf.setDrawColor(200, 200, 200);
    pdf.line(15, footerY, 195, footerY);

    pdf.setFontSize(8);
    pdf.setTextColor(107, 114, 128);
    pdf.text('This is a computer-generated receipt and does not require a signature.', 105, footerY + 5, { align: 'center' });
    pdf.text(`Generated on ${new Date().toLocaleString('en-GB')}`, 105, footerY + 10, { align: 'center' });

    if (action === 'view') {
        const pdfBlob = pdf.output('blob');
        const pdfUrl = URL.createObjectURL(pdfBlob);
        window.open(pdfUrl, '_blank');
    } else {
        // Save PDF
        pdf.save(`Castle-Depots-Receipt-${order.id.slice(0, 8)}.pdf`);
    }
};
