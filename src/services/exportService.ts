import React from 'react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export interface ExportOptions {
  filename: string;
  title?: string;
  subtitle?: string;
  includeTimestamp?: boolean;
  customHeaders?: string[];
}

export interface ChartExportData {
  chartRef: React.RefObject<HTMLDivElement>;
  title: string;
  data: any[];
}

export class EnhancedExportService {
  // Enhanced CSV Export with custom formatting
  static exportToCSV(data: any[], options: ExportOptions): void {
    const { filename, title, includeTimestamp = true } = options;
    
    let csvContent = '';
    
    // Add title and timestamp if requested
    if (title) {
      csvContent += `${title}\n`;
    }
    if (includeTimestamp) {
      csvContent += `Generated on: ${new Date().toLocaleString()}\n\n`;
    }
    
    if (data.length === 0) {
      csvContent += 'No data available\n';
    } else {
      // Get headers from first object
      const headers = Object.keys(data[0]);
      csvContent += headers.join(',') + '\n';
      
      // Add data rows
      data.forEach(row => {
        const values = headers.map(header => {
          const value = row[header];
          // Handle values that might contain commas
          return typeof value === 'string' && value.includes(',') 
            ? `"${value}"` 
            : value;
        });
        csvContent += values.join(',') + '\n';
      });
    }
    
    // Download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Excel Export with multiple sheets
  static exportToExcel(sheets: { name: string; data: any[]; title?: string }[], filename: string): void {
    const workbook = XLSX.utils.book_new();
    
    sheets.forEach(sheet => {
      const { name, data, title } = sheet;
      
      // Create worksheet data
      let wsData: any[][] = [];
      
      if (title) {
        wsData.push([title]);
        wsData.push([`Generated on: ${new Date().toLocaleString()}`]);
        wsData.push([]); // Empty row
      }
      
      if (data.length > 0) {
        // Add headers
        const headers = Object.keys(data[0]);
        wsData.push(headers);
        
        // Add data rows
        data.forEach(row => {
          const rowData = headers.map(header => row[header]);
          wsData.push(rowData);
        });
      } else {
        wsData.push(['No data available']);
      }
      
      const worksheet = XLSX.utils.aoa_to_sheet(wsData);
      
      // Auto-size columns
      const colWidths = wsData[0]?.map(() => ({ wch: 15 })) || [];
      worksheet['!cols'] = colWidths;
      
      XLSX.utils.book_append_sheet(workbook, worksheet, name);
    });
    
    XLSX.writeFile(workbook, `${filename}.xlsx`);
  }

  // Enhanced PNG Export with better quality
  static async exportToPNG(
    chartRef: React.RefObject<HTMLDivElement>, 
    filename: string,
    options: { quality?: number; backgroundColor?: string } = {}
  ): Promise<void> {
    const { quality = 2, backgroundColor = '#ffffff' } = options;
    
    if (!chartRef.current) {
      console.error('Chart reference is null');
      return;
    }

    try {
      const canvas = await html2canvas(chartRef.current, {
        scale: quality,
        backgroundColor,
        useCORS: true,
        allowTaint: true
      });
      
      const link = document.createElement('a');
      link.download = `${filename}.png`;
      link.href = canvas.toDataURL();
      link.click();
    } catch (error) {
      console.error('Error exporting PNG:', error);
    }
  }

  // PDF Report Generation
  static async exportToPDF(
    charts: ChartExportData[],
    summaryData: any,
    options: ExportOptions
  ): Promise<void> {
    const { filename, title = 'Analytics Report', subtitle } = options;
    
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    let yPosition = 20;
    
    // Add title
    pdf.setFontSize(20);
    pdf.text(title, pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 15;
    
    if (subtitle) {
      pdf.setFontSize(14);
      pdf.text(subtitle, pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 10;
    }
    
    // Add timestamp
    pdf.setFontSize(10);
    pdf.text(`Generated on: ${new Date().toLocaleString()}`, pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 20;
    
    // Add summary data
    if (summaryData) {
      pdf.setFontSize(16);
      pdf.text('Summary', 20, yPosition);
      yPosition += 10;
      
      pdf.setFontSize(12);
      Object.entries(summaryData).forEach(([key, value]) => {
        pdf.text(`${key}: ${value}`, 20, yPosition);
        yPosition += 8;
      });
      yPosition += 10;
    }
    
    // Add charts
    for (const chart of charts) {
      if (chart.chartRef.current) {
        try {
          // Check if we need a new page
          if (yPosition > pageHeight - 100) {
            pdf.addPage();
            yPosition = 20;
          }
          
          const canvas = await html2canvas(chart.chartRef.current, {
            scale: 1,
            backgroundColor: '#ffffff'
          });
          
          const imgData = canvas.toDataURL('image/png');
          const imgWidth = pageWidth - 40;
          const imgHeight = (canvas.height * imgWidth) / canvas.width;
          
          // Add chart title
          pdf.setFontSize(14);
          pdf.text(chart.title, 20, yPosition);
          yPosition += 10;
          
          // Add chart image
          pdf.addImage(imgData, 'PNG', 20, yPosition, imgWidth, imgHeight);
          yPosition += imgHeight + 20;
          
        } catch (error) {
          console.error(`Error adding chart ${chart.title} to PDF:`, error);
        }
      }
    }
    
    pdf.save(`${filename}.pdf`);
  }

  // PowerPoint Export (simplified version)
  static exportToPowerPoint(
    charts: ChartExportData[],
    summaryData: any,
    options: ExportOptions
  ): void {
    // This is a simplified implementation
    // In a real application, you might use libraries like PptxGenJS
    console.log('PowerPoint export would be implemented here');
    console.log('Charts:', charts.length);
    console.log('Summary:', summaryData);
    console.log('Options:', options);
    
    // For now, we'll export as PDF instead
    this.exportToPDF(charts, summaryData, options);
  }

  // Batch export multiple formats
  static async exportMultipleFormats(
    data: any[],
    chartRefs: React.RefObject<HTMLDivElement>[],
    formats: ('csv' | 'excel' | 'png' | 'pdf')[],
    options: ExportOptions
  ): Promise<void> {
    const { filename } = options;
    
    for (const format of formats) {
      try {
        switch (format) {
          case 'csv':
            this.exportToCSV(data, options);
            break;
          case 'excel':
            this.exportToExcel([{ name: 'Data', data }], filename);
            break;
          case 'png':
            for (let i = 0; i < chartRefs.length; i++) {
              await this.exportToPNG(chartRefs[i], `${filename}_chart_${i + 1}`);
            }
            break;
          case 'pdf':
            const charts = chartRefs.map((ref, index) => ({
              chartRef: ref,
              title: `Chart ${index + 1}`,
              data: []
            }));
            await this.exportToPDF(charts, {}, options);
            break;
        }
      } catch (error) {
        console.error(`Error exporting ${format}:`, error);
      }
    }
  }
}

export default EnhancedExportService;
