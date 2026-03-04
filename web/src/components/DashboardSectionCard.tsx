import { Card, CardContent, Divider, List, ListItem, ListItemText, Stack, Typography } from '@mui/material';
import type { DashboardSection } from '../lib/dashboardSections';

type DashboardSectionCardProps = {
  section: DashboardSection;
};

export function DashboardSectionCard({ section }: DashboardSectionCardProps) {
  return (
    <Card variant="outlined" sx={{ height: '100%' }}>
      <CardContent>
        <Stack spacing={1}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">{section.title}</Typography>
            <Typography variant="body2" color="text.secondary">
              {section.items.length}
            </Typography>
          </Stack>
          <Divider />
          {section.items.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No items yet.
            </Typography>
          ) : (
            <List dense disablePadding>
              {section.items.map((item) => (
                <ListItem key={item.id} disableGutters divider>
                  <ListItemText
                    primary={item.primary}
                    secondary={[item.secondary, item.date].filter(Boolean).join(' • ') || undefined}
                  />
                </ListItem>
              ))}
            </List>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
