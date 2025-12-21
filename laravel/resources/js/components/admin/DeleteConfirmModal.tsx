import React, { useState } from 'react';
import { X, AlertTriangle, CheckCircle } from 'lucide-react';

// Modal Konfirmasi Delete
export function DeleteConfirmationModal({ isOpen, onClose, onConfirm, itemName, itemType = "data" }:
  {isOpen: boolean, onClose: any, onConfirm: any, itemName: string, itemType?:string}
) {
  if (!isOpen) return null; 

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-white rounded-lg shadow-xl max-w-md w-full animate-fade-in">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Konfirmasi Hapus</h2>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          <p className="text-gray-700 mb-2">
            Apakah Anda yakin ingin menghapus {itemType}:
          </p>
          <p className="text-gray-900 font-semibold mb-4">
            "{itemName}"
          </p>
          <p className="text-sm text-gray-600">
            Tindakan ini tidak dapat dibatalkan. Data yang dihapus akan hilang secara permanen.
          </p>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 border border-gray-300 text-gray-900 rounded-lg hover:bg-gray-100 transition-colors font-medium"
          >
            Batal
          </button>
          <button 
            onClick={onConfirm}
            className="px-6 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
          >
            Ya, Hapus
          </button>
        </div>
      </div>
    </div>
  );
}