import { useState } from 'react';
import { 
  FileText, 
  Download,
  Printer,
  Mail,
  CheckCircle,
  Clock,
  Users,
  Shield,
  UserCheck,
  UserX
} from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { User, Role } from '../../data/types/users.types';

interface UserReportsProps {
  users: User[];
  roles: Role[];
}

type ReportType = 'users-list' | 'roles-permissions' | 'activity-summary' | 'complete';

export function UserReports({ users, roles }: UserReportsProps) {
  const [selectedReport, setSelectedReport] = useState<ReportType>('complete');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Calcular estadísticas
  const activeUsers = users.filter(u => u.status === 'active').length;
  const inactiveUsers = users.filter(u => u.status === 'inactive').length;

  // Agrupar usuarios por rol
  const usersByRole = roles.map(role => ({
    role: role.name,
    count: users.filter(u => u.role === role.name).length,
    permissions: role.permissionsCount || 0
  }));

  const handleDownloadPDF = async () => {
    setIsGenerating(true);
    
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const now = new Date();
      const dateStr = formatDate(now);
      
      // Colores
      const primaryColor: [number, number, number] = [208, 50, 58]; // #D0323A
      const grayColor: [number, number, number] = [100, 100, 100];
      
      // Header
      doc.setFillColor(...primaryColor);
      doc.rect(0, 0, pageWidth, 35, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text('Reporte de Usuarios y Roles', pageWidth / 2, 15, { align: 'center' });
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Generado el ${dateStr}`, pageWidth / 2, 23, { align: 'center' });
      doc.text('iWA SmartOps - Sistema de Gestión Empresarial', pageWidth / 2, 30, { align: 'center' });
      
      // Resumen Ejecutivo
      let yPos = 45;
      doc.setTextColor(...primaryColor);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Resumen Ejecutivo', 14, yPos);
      
      yPos += 10;
      doc.setFillColor(249, 250, 251);
      doc.rect(14, yPos - 5, pageWidth - 28, 30, 'F');
      
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      
      const summaryData = [
        ['Total Usuarios:', users.length.toString()],
        ['Usuarios Activos:', activeUsers.toString()],
        ['Usuarios Inactivos:', inactiveUsers.toString()],
        ['Total Roles:', roles.length.toString()]
      ];
      
      const colWidth = (pageWidth - 28) / 2;
      summaryData.forEach((item, index) => {
        const xOffset = index < 2 ? 18 : 18 + colWidth;
        const yOffset = yPos + (index % 2) * 12;
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...grayColor);
        doc.text(item[0], xOffset, yOffset);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 0, 0);
        doc.text(item[1], xOffset + 40, yOffset);
      });
      
      yPos += 35;

      // Tabla de Usuarios
      if (selectedReport === 'complete' || selectedReport === 'users-list') {
        doc.setTextColor(...primaryColor);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('Listado de Usuarios', 14, yPos);
        yPos += 5;

        const usersTableData = users.map(u => [
          u.name,
          u.email,
          u.role,
          u.status === 'active' ? 'Activo' : 'Inactivo',
          u.createdAt || 'N/A'
        ]);

        autoTable(doc, {
          startY: yPos,
          head: [['Nombre', 'Email', 'Rol', 'Estado', 'Fecha Creación']],
          body: usersTableData,
          theme: 'striped',
          headStyles: { fillColor: primaryColor, fontSize: 9 },
          bodyStyles: { fontSize: 8 },
          columnStyles: {
            0: { cellWidth: 35 },
            1: { cellWidth: 50 },
            2: { cellWidth: 30 },
            3: { cellWidth: 25, halign: 'center' },
            4: { cellWidth: 30, halign: 'center' }
          },
          foot: [[
            'TOTAL', '', '', `${activeUsers} activos`, ''
          ]],
          footStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0], fontStyle: 'bold', fontSize: 8 }
        });

        yPos = (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10;
      }

      // Tabla de Roles y Permisos
      if (selectedReport === 'complete' || selectedReport === 'roles-permissions') {
        if (yPos > 230) {
          doc.addPage();
          yPos = 20;
        }

        doc.setTextColor(...primaryColor);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('Roles y Permisos', 14, yPos);
        yPos += 5;

        const rolesTableData = roles.map(r => [
          r.name,
          r.description,
          (r.permissionsCount || 0).toString(),
          (r.usersCount || users.filter(u => u.role === r.name).length).toString()
        ]);

        autoTable(doc, {
          startY: yPos,
          head: [['Rol', 'Descripción', 'Permisos', 'Usuarios']],
          body: rolesTableData,
          theme: 'striped',
          headStyles: { fillColor: primaryColor, fontSize: 9 },
          bodyStyles: { fontSize: 8 },
          columnStyles: {
            0: { cellWidth: 40 },
            1: { cellWidth: 80 },
            2: { cellWidth: 25, halign: 'center' },
            3: { cellWidth: 25, halign: 'center' }
          }
        });

        yPos = (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10;
      }

      // Distribución por Rol
      if (selectedReport === 'complete' || selectedReport === 'activity-summary') {
        if (yPos > 200) {
          doc.addPage();
          yPos = 20;
        }

        doc.setTextColor(...primaryColor);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('Distribución de Usuarios por Rol', 14, yPos);
        yPos += 5;

        const distributionData = usersByRole.map(item => [
          item.role,
          item.count.toString(),
          `${((item.count / users.length) * 100).toFixed(1)}%`,
          item.permissions.toString()
        ]);

        autoTable(doc, {
          startY: yPos,
          head: [['Rol', 'Usuarios', 'Porcentaje', 'Permisos Asignados']],
          body: distributionData,
          theme: 'striped',
          headStyles: { fillColor: primaryColor, fontSize: 9 },
          bodyStyles: { fontSize: 8 },
          columnStyles: {
            0: { cellWidth: 50 },
            1: { cellWidth: 30, halign: 'center' },
            2: { cellWidth: 30, halign: 'center' },
            3: { cellWidth: 40, halign: 'center' }
          }
        });
      }

      // Footer
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(...grayColor);
        doc.text(
          `Página ${i} de ${pageCount} | iWA SmartOps - Reporte generado automáticamente`,
          pageWidth / 2,
          doc.internal.pageSize.getHeight() - 10,
          { align: 'center' }
        );
      }

      // Descargar PDF
      const fileName = `reporte-usuarios-${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);
      
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Error generando PDF:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const reportTypes = [
    {
      id: 'complete' as ReportType,
      title: 'Reporte Completo',
      description: 'Incluye usuarios, roles y distribución',
      icon: FileText
    },
    {
      id: 'users-list' as ReportType,
      title: 'Listado de Usuarios',
      description: 'Detalle de todos los usuarios del sistema',
      icon: Users
    },
    {
      id: 'roles-permissions' as ReportType,
      title: 'Roles y Permisos',
      description: 'Configuración de roles y permisos asignados',
      icon: Shield
    },
    {
      id: 'activity-summary' as ReportType,
      title: 'Distribución por Rol',
      description: 'Análisis de usuarios por rol',
      icon: UserCheck
    }
  ];

  return (
    <div className="space-y-6">
      {/* Mensaje de éxito */}
      {showSuccess && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50 animate-pulse">
          <CheckCircle className="w-5 h-5" />
          <span>Reporte generado exitosamente</span>
        </div>
      )}

      {/* Header de reportes */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Generador de Reportes</h2>
            <p className="text-gray-500 mt-1">Selecciona el tipo de reporte y descárgalo en PDF</p>
          </div>
          <button
            onClick={handleDownloadPDF}
            disabled={isGenerating}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
              isGenerating 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-[#D0323A] text-white hover:bg-[#9F2743] shadow-lg hover:shadow-xl'
            }`}
          >
            {isGenerating ? (
              <>
                <Clock className="w-5 h-5 animate-spin" />
                Generando...
              </>
            ) : (
              <>
                <Download className="w-5 h-5" />
                Descargar PDF
              </>
            )}
          </button>
        </div>

        {/* Tipos de reporte */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {reportTypes.map((report) => (
            <button
              key={report.id}
              onClick={() => setSelectedReport(report.id)}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                selectedReport === report.id
                  ? 'border-[#D0323A] bg-red-50'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${
                selectedReport === report.id ? 'bg-[#D0323A] text-white' : 'bg-gray-100 text-gray-600'
              }`}>
                <report.icon className="w-5 h-5" />
              </div>
              <h3 className={`font-medium mb-1 ${
                selectedReport === report.id ? 'text-[#D0323A]' : 'text-gray-900'
              }`}>
                {report.title}
              </h3>
              <p className="text-sm text-gray-500">{report.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Vista previa del reporte */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Vista Previa del Reporte</h3>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
              <Printer className="w-4 h-4" />
              Imprimir
            </button>
            <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
              <Mail className="w-4 h-4" />
              Enviar por Email
            </button>
          </div>
        </div>

        {/* Contenido de vista previa */}
        <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
          <div className="text-center mb-6 pb-4 border-b-2 border-[#D0323A]">
            <h2 className="text-2xl font-bold text-[#D0323A]">👥 Reporte de Usuarios y Roles</h2>
            <p className="text-gray-500 mt-2">Generado el {formatDate(new Date())}</p>
          </div>

          {/* Resumen */}
          <div className="bg-gradient-to-r from-[#D0323A] to-[#E9540D] text-white p-6 rounded-xl mb-6">
            <h3 className="text-lg font-semibold mb-4">Resumen Ejecutivo</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-sm opacity-90">Total Usuarios</p>
                <p className="text-xl font-bold">{users.length}</p>
              </div>
              <div className="text-center">
                <p className="text-sm opacity-90">Activos</p>
                <p className="text-xl font-bold">{activeUsers}</p>
              </div>
              <div className="text-center">
                <p className="text-sm opacity-90">Inactivos</p>
                <p className="text-xl font-bold">{inactiveUsers}</p>
              </div>
              <div className="text-center">
                <p className="text-sm opacity-90">Total Roles</p>
                <p className="text-xl font-bold">{roles.length}</p>
              </div>
            </div>
          </div>

          {/* Tabla de usuarios (preview) */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-300">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Usuario</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Email</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Rol</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-gray-600">Estado</th>
                </tr>
              </thead>
              <tbody>
                {users.slice(0, 3).map((u) => (
                  <tr key={u.id} className="border-b border-gray-200">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-[#D0323A] text-white rounded-full flex items-center justify-center text-sm font-medium">
                          {u.avatar || u.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </div>
                        <span className="font-medium text-gray-900">{u.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{u.email}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
                        u.status === 'active' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {u.status === 'active' ? <UserCheck className="w-3 h-3" /> : <UserX className="w-3 h-3" />}
                        {u.status === 'active' ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {users.length > 3 && (
              <p className="text-center text-gray-500 text-sm mt-4">
                ... y {users.length - 3} usuarios más en el reporte completo
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Historial de reportes (simulado) */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Reportes Recientes</h3>
        <div className="space-y-3">
          {[
            { date: '2024-12-20', type: 'Reporte Completo', size: '185 KB' },
            { date: '2024-12-15', type: 'Listado de Usuarios', size: '98 KB' },
            { date: '2024-12-10', type: 'Roles y Permisos', size: '76 KB' },
          ].map((report, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#D0323A]/10 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-[#D0323A]" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{report.type}</p>
                  <p className="text-sm text-gray-500">{report.date} • {report.size}</p>
                </div>
              </div>
              <button className="p-2 text-gray-400 hover:text-[#D0323A] transition-colors">
                <Download className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
