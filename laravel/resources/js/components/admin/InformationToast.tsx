import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, X, AlertCircle, Info } from 'lucide-react';

// Notification Component
const Notification = ({ type = 'success', message, onClose, duration = 5000 }: {type: string, message: string, onClose: any, duration: number}) => {
  useEffect(() => {
    if (duration) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const configs = {
    success: {
      icon: CheckCircle,
      bgColor: 'bg-teal-50',
      borderColor: 'border-teal-500',
      iconColor: 'text-teal-600',
      textColor: 'text-teal-900',
      title: 'Berhasil!'
    },
    error: {
      icon: XCircle,
      bgColor: 'bg-red-50',
      borderColor: 'border-red-500',
      iconColor: 'text-red-600',
      textColor: 'text-red-900',
      title: 'Error!'
    },
    warning: {
      icon: AlertCircle,
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-500',
      iconColor: 'text-yellow-600',
      textColor: 'text-yellow-900',
      title: 'Peringatan!'
    },
    info: {
      icon: Info,
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-500',
      iconColor: 'text-blue-600',
      textColor: 'text-blue-900',
      title: 'Informasi'
    }
  };

  const config = configs[type];
  const Icon = config.icon;

  return (
    <div className={`${config.bgColor} ${config.borderColor} border-l-4 rounded-lg shadow-lg p-4 mb-4 flex items-start gap-3 min-w-[320px] max-w-md animate-slideIn`}>
      <Icon className={`${config.iconColor} w-6 h-6 flex-shrink-0 mt-0.5`} />
      <div className="flex-1">
        <h4 className={`font-semibold ${config.textColor} mb-1`}>{config.title}</h4>
        <p className={`text-sm ${config.textColor} opacity-90`}>{message}</p>
      </div>
      <button
        onClick={onClose}
        className={`${config.iconColor} hover:opacity-70 transition-opacity flex-shrink-0`}
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
};

// Notification Container
export const AdminNotificationToast = ({ notifications, removeNotification }) => {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col items-end">
      {notifications.map((notif) => (
        <Notification
          key={notif.id}
          type={notif.type}
          message={notif.message}
          onClose={() => removeNotification(notif.id)}
          duration={notif.duration}
        />
      ))}
    </div>
  );
};
