import { FileX, CheckCircle, Search, Inbox, AlertCircle } from 'lucide-react';
import Button from './Button';

const EmptyState = ({ 
  type = 'default',
  title,
  description,
  action,
  actionLabel,
  icon:  CustomIcon
}) => {
  // Predefined empty states
  const emptyStates = {
    todos: {
      icon: CheckCircle,
      title: 'No todos yet',
      description: 'Start being productive!  Create your first todo to get started.',
      iconColor: '#406e8e'
    },
    search: {
      icon: Search,
      title: 'No results found',
      description: 'Try adjusting your search terms or filters.',
      iconColor: '#8ea8c3'
    },
    completed: {
      icon: Inbox,
      title: 'No completed tasks',
      description: 'Tasks you complete will appear here.',
      iconColor: '#10b981'
    },
    error: {
      icon: AlertCircle,
      title: 'Something went wrong',
      description: 'Unable to load data. Please try again.',
      iconColor: '#ef4444'
    },
    default: {
      icon: FileX,
      title: 'No data available',
      description: 'There is nothing to display at the moment.',
      iconColor: '#8ea8c3'
    }
  };

  const state = emptyStates[type] || emptyStates.default;
  const Icon = CustomIcon || state.icon;
  const finalTitle = title || state.title;
  const finalDescription = description || state.description;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '60px 20px',
      textAlign: 'center'
    }}>
      <div style={{
        width: '100px',
        height: '100px',
        borderRadius: '50%',
        background: `${state.iconColor}15`,
        display: 'flex',
        alignItems: 'center',
        justifyContent:  'center',
        marginBottom: '24px'
      }}>
        <Icon size={48} color={state.iconColor} />
      </div>

      <h3 style={{
        fontSize: '24px',
        fontWeight:  '600',
        color: '#cbf7ed',
        marginBottom: '12px'
      }}>
        {finalTitle}
      </h3>

      <p style={{
        color: '#8ea8c3',
        fontSize: '16px',
        maxWidth: '400px',
        lineHeight: '1.6',
        marginBottom: action ? '24px' : '0'
      }}>
        {finalDescription}
      </p>

      {action && actionLabel && (
        <Button onClick={action} variant="primary">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState; 