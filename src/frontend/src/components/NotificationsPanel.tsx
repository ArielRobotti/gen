import NotificationItem from "./NotificationItem";
// import { Notification } from "../declarations/backend/backend.did";
import { useSession } from "../context/sessionContext";
// import { useState } from "react";

interface Props {
  onClose: () => void;
}

const NotificationsPanel = ({onClose}: Props) => {
  const { notifications, backend, markNotificationAsRead } = useSession();


  return (
    <>
      <div className="fixed top-0 left-0 h-full w-full z-80" onClick={onClose} />
      <div className="absolute top-[38px] text-xs text-gray-200 right-[60px] mt-2 w-[75vw] sm:flex-items-center max-w-80 bg-gray-900 rounded-lg shadow-lg z-90 animate-fade-in">
        <div className="p-3 border-b border-gray-500 font-semibold text-lg text-center">Notifications</div>
        <div className="max-h-80 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-4 text-gray-500 text-sm">There are no notifications</div>
          ) : (
            [...notifications].reverse().map((notif, idx) => (
              <NotificationItem
                key={idx}
                notif={notif}
                onClick={() => {
                  // llamada ignorada al backend para setear la notificacion como leida
                  backend.readNotification(notif.date);
                  markNotificationAsRead(notif.date)
                  onClose();
                }}
              />
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default NotificationsPanel;