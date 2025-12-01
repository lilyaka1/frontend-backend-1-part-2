import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  RadioButtonUnchecked as RadioButtonUncheckedIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  OpenInNew as OpenInNewIcon,
  Event as EventIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { useState } from 'react';
import { Link } from 'react-router-dom';

function MuiTechnologyCard({ technology, onEdit, onDelete, onStatusChange }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    onEdit && onEdit(technology);
    handleMenuClose();
  };

  const handleDelete = () => {
    onDelete && onDelete(technology.id);
    handleMenuClose();
  };

  const getStatusIcon = () => {
    switch (technology.status) {
      case 'completed':
        return <CheckCircleIcon color="success" />;
      case 'in-progress':
        return <ScheduleIcon color="warning" />;
      default:
        return <RadioButtonUncheckedIcon color="disabled" />;
    }
  };

  const getStatusColor = () => {
    switch (technology.status) {
      case 'completed':
        return 'success';
      case 'in-progress':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getStatusText = () => {
    switch (technology.status) {
      case 'completed':
        return 'Завершено';
      case 'in-progress':
        return 'В процессе';
      default:
        return 'Не начато';
    }
  };

  const getCategoryColor = () => {
    switch (technology.category) {
      case 'frontend':
        return 'primary';
      case 'backend':
        return 'secondary';
      case 'database':
        return 'info';
      case 'devops':
        return 'warning';
      default:
        return 'default';
    }
  };

  // Проверка просроченного дедлайна
  const isOverdue = technology.deadline && 
    new Date(technology.deadline) < new Date() && 
    technology.status !== 'completed';

  const handleStatusCycle = () => {
    const statusOrder = ['not-started', 'in-progress', 'completed'];
    const currentIndex = statusOrder.indexOf(technology.status);
    const nextIndex = (currentIndex + 1) % statusOrder.length;
    onStatusChange && onStatusChange(technology.id, statusOrder[nextIndex]);
  };

  return (
    <Card
      elevation={2}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        borderLeft: isOverdue ? '4px solid' : 'none',
        borderLeftColor: isOverdue ? 'error.main' : 'transparent',
      }}
    >
      {/* Иконка меню */}
      <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
        <IconButton
          size="small"
          onClick={handleMenuClick}
          aria-label="options"
        >
          <MoreVertIcon />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleEdit}>
            <EditIcon fontSize="small" sx={{ mr: 1 }} />
            Редактировать
          </MenuItem>
          <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
            <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
            Удалить
          </MenuItem>
        </Menu>
      </Box>

      <CardContent sx={{ flexGrow: 1, pt: 1 }}>
        {/* Заголовок с иконкой статуса */}
        <Box display="flex" alignItems="flex-start" gap={1} mb={1}>
          {getStatusIcon()}
          <Typography variant="h6" component="h3" sx={{ flexGrow: 1, pr: 4 }}>
            <Link
              to={`/technology/${technology.id}`}
              style={{
                textDecoration: 'none',
                color: 'inherit',
              }}
            >
              {technology.title}
            </Link>
          </Typography>
        </Box>

        {/* Описание */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 2,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {technology.description}
        </Typography>

        {/* Chips (Категория и Статус) */}
        <Box display="flex" gap={1} flexWrap="wrap" mb={1}>
          <Chip
            label={technology.category}
            size="small"
            color={getCategoryColor()}
            variant="outlined"
          />
          <Chip
            label={getStatusText()}
            size="small"
            color={getStatusColor()}
            onClick={handleStatusCycle}
            sx={{ cursor: 'pointer' }}
          />
        </Box>

        {/* Дедлайн */}
        {technology.deadline && (
          <Box
            display="flex"
            alignItems="center"
            gap={0.5}
            mt={1}
            sx={{
              color: isOverdue ? 'error.main' : 'text.secondary',
              fontSize: '0.875rem',
            }}
          >
            {isOverdue ? <WarningIcon fontSize="small" /> : <EventIcon fontSize="small" />}
            <Typography variant="caption">
              {isOverdue ? 'Просрочено: ' : 'Срок: '}
              {new Date(technology.deadline).toLocaleDateString('ru-RU')}
            </Typography>
          </Box>
        )}
      </CardContent>

      {/* Действия */}
      <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
        {technology.githubUrl ? (
          <Tooltip title="Открыть на GitHub">
            <Button
              size="small"
              startIcon={<OpenInNewIcon />}
              href={technology.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </Button>
          </Tooltip>
        ) : (
          <Box />
        )}

        {technology.status !== 'completed' && (
          <Button
            size="small"
            variant="outlined"
            onClick={handleStatusCycle}
          >
            {technology.status === 'in-progress' ? 'Завершить' : 'Начать'}
          </Button>
        )}
      </CardActions>
    </Card>
  );
}

export default MuiTechnologyCard;
