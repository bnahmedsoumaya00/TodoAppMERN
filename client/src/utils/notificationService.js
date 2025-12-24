// Request notification permission
export const requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
};

// Check if notifications are supported and permitted
export const canShowNotifications = () => {
  return 'Notification' in window && Notification.permission === 'granted';
};

// Show a notification
export const showNotification = (title, options = {}) => {
  if (!canShowNotifications()) {
    console.log('Notifications not permitted');
    return null;
  }

  const defaultOptions = {
    icon: '/vite.svg',
    badge: '/vite.svg',
    vibrate: [200, 100, 200],
    requireInteraction: false,
    ...options
  };

  try {
    return new Notification(title, defaultOptions);
  } catch (error) {
    console.error('Error showing notification:', error);
    return null;
  }
};

// Show todo reminder notification
export const showTodoReminder = (todo) => {
  const notification = showNotification('📋 Todo Reminder', {
    body: todo.title,
    tag: `todo-${todo.id}`,
    data: { todoId: todo.id },
    actions: [
      { action: 'complete', title: 'Mark Complete' },
      { action: 'snooze', title: 'Snooze 1h' }
    ]
  });

  if (notification) {
    notification.onclick = () => {
      window.focus();
      notification.close();
    };
  }

  return notification;
};

// Show overdue todo notification
export const showOverdueNotification = (todos) => {
  if (todos.length === 0) return;

  const count = todos.length;
  const title = count === 1 ? '⚠️ Overdue Task' : `⚠️ ${count} Overdue Tasks`;
  const body = count === 1 
    ? todos[0].title 
    :  `You have ${count} overdue tasks`;

  showNotification(title, {
    body,
    tag: 'overdue-todos',
    requireInteraction: true
  });
};

// Check for due todos and show notifications
export const checkDueTodos = (todos) => {
  if (! canShowNotifications()) return;

  const now = new Date();
  const overdueThreshold = 24 * 60 * 60 * 1000; // 24 hours

  todos. forEach(todo => {
    if (todo.completed || ! todo.due_date) return;

    const dueDate = new Date(todo. due_date);
    const timeDiff = dueDate - now;

    // Notify 1 hour before
    if (timeDiff > 0 && timeDiff <= 60 * 60 * 1000) {
      showTodoReminder(todo);
    }
    
    // Notify if overdue
    if (timeDiff < 0 && Math.abs(timeDiff) <= overdueThreshold) {
      showOverdueNotification([todo]);
    }
  });
};

// Schedule notifications check (every 15 minutes)
export const startNotificationScheduler = (getTodos) => {
  // Check immediately
  if (canShowNotifications()) {
    const todos = getTodos();
    checkDueTodos(todos);
  }

  // Then check every 15 minutes
  const interval = setInterval(() => {
    if (canShowNotifications()) {
      const todos = getTodos();
      checkDueTodos(todos);
    }
  }, 15 * 60 * 1000);

  return () => clearInterval(interval);
};