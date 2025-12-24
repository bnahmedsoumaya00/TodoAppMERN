const Skeleton = ({ 
  variant = 'text',
  width = '100%',
  height,
  borderRadius = '8px',
  count = 1,
  className = ''
}) => {
  const getHeight = () => {
    if (height) return height;
    
    switch (variant) {
      case 'text':
        return '16px';
      case 'title':
        return '28px';
      case 'avatar':
        return '48px';
      case 'card':
        return '200px';
      case 'button':
        return '40px';
      default:
        return '16px';
    }
  };

  const getWidth = () => {
    if (width) return width;
    
    if (variant === 'avatar') return '48px';
    return '100%';
  };

  const skeletonStyle = {
    width: getWidth(),
    height: getHeight(),
    borderRadius: variant === 'avatar' ? '50%' : borderRadius,
    background: 'linear-gradient(90deg, #23395b 0%, #2d4a6b 50%, #23395b 100%)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 1. 5s infinite',
    marginBottom: count > 1 ? '12px' : '0'
  };

  return (
    <>
      {Array. from({ length: count }).map((_, index) => (
        <div 
          key={index} 
          className={`skeleton ${className}`}
          style={skeletonStyle}
        />
      ))}
      
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </>
  );
};

// Specific skeleton components
export const SkeletonText = (props) => <Skeleton variant="text" {...props} />;
export const SkeletonTitle = (props) => <Skeleton variant="title" {...props} />;
export const SkeletonAvatar = (props) => <Skeleton variant="avatar" {...props} />;
export const SkeletonCard = (props) => <Skeleton variant="card" {... props} />;
export const SkeletonButton = (props) => <Skeleton variant="button" {...props} />;

// Todo item skeleton
export const TodoItemSkeleton = () => (
  <div style={{
    background: '#23395b',
    border:  '1px solid #2d3748',
    borderRadius: '12px',
    padding: '16px',
    marginBottom: '12px'
  }}>
    <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
      <Skeleton variant="avatar" width="20px" height="20px" />
      <Skeleton variant="text" width="60%" />
    </div>
    <Skeleton variant="text" width="40%" height="12px" />
    <div style={{ 
      display: 'flex', 
      gap: '8px', 
      marginTop: '12px',
      alignItems: 'center'
    }}>
      <Skeleton variant="button" width="80px" height="28px" />
      <Skeleton variant="button" width="80px" height="28px" />
    </div>
  </div>
);

// Stats card skeleton
export const StatsCardSkeleton = () => (
  <div style={{
    background:  '#23395b',
    border: '1px solid #2d3748',
    borderRadius:  '12px',
    padding:  '1. 5rem'
  }}>
    <div style={{ 
      display: 'flex', 
      justifyContent: 'space-between',
      alignItems: 'flex-start'
    }}>
      <div style={{ flex: 1 }}>
        <Skeleton variant="title" width="60px" height="32px" />
        <Skeleton variant="text" width="100px" height="14px" style={{ marginTop: '8px' }} />
      </div>
      <Skeleton variant="avatar" width="48px" height="48px" />
    </div>
  </div>
);

export default Skeleton;