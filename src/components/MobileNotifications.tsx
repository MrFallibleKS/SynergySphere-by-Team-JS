
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const MobileNotifications: React.FC = () => {
  const { currentUser } = useAuth();
  const { notifications, markNotificationAsRead } = useData();

  // Get all notifications for the current user
  const userNotifications = notifications.filter(
    n => n.userId === currentUser?.id
  );

  // Separate into unread and read
  const unreadNotifications = userNotifications.filter(n => !n.read);
  const readNotifications = userNotifications.filter(n => n.read);

  const formatNotificationText = (type: string) => {
    switch (type) {
      case 'TASK_ASSIGNED':
        return 'New Task Assigned';
      case 'COMMENT_ADDED':
        return 'New Comment';
      case 'TASK_DUE_SOON':
        return 'Task Due Soon';
      default:
        return 'New Notification';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-4">Notifications</h2>
        
        {unreadNotifications.length > 0 && (
          <>
            <h3 className="font-medium text-lg mb-2">New</h3>
            <div className="space-y-2">
              {unreadNotifications.map(notification => (
                <Card key={notification.id} className="bg-synergy-50">
                  <CardHeader className="pb-2 pt-3">
                    <CardTitle className="text-base">
                      {formatNotificationText(notification.type)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pb-3 pt-0">
                    <p className="text-sm text-gray-500">
                      {new Date(notification.createdAt).toLocaleString()}
                    </p>
                    <div className="mt-2">
                      <Button
                        size="sm"
                        onClick={() => markNotificationAsRead(notification.id)}
                      >
                        Mark as read
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}

        {readNotifications.length > 0 && (
          <>
            <h3 className="font-medium text-lg mb-2 mt-4">Earlier</h3>
            <div className="space-y-2">
              {readNotifications.slice(0, 5).map(notification => (
                <Card key={notification.id} className="bg-gray-50">
                  <CardHeader className="pb-2 pt-3">
                    <CardTitle className="text-base">
                      {formatNotificationText(notification.type)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pb-3 pt-0">
                    <p className="text-sm text-gray-500">
                      {new Date(notification.createdAt).toLocaleString()}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}

        {userNotifications.length === 0 && (
          <div className="text-center p-6 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No notifications yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileNotifications;
