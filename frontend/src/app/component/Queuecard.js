import { Card, CardContent, Typography, Button } from '@mui/material';

export default function QueueCard({ id, name, onRemove }) {
  return (
    <Card style={{ marginBottom: '16px' }}>
      <CardContent>
        <Typography variant="h6">{name}</Typography>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => onRemove(id)}
        >
          Remove
        </Button>
      </CardContent>
    </Card>
  );
}
