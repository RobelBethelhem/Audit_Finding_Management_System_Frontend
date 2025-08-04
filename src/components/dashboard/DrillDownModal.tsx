import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  ArrowLeft,
  ExternalLink,
  Calendar,
  User,
  AlertTriangle,
  FileText
} from 'lucide-react';

export interface DrillDownLevel {
  id: string;
  title: string;
  type: 'department' | 'user' | 'status' | 'finding' | 'actionplan';
  data: any;
}

export interface DrillDownPath {
  levels: DrillDownLevel[];
  currentLevel: number;
}

interface DrillDownModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: {
    type: string;
    value: string;
    label: string;
    data: any[];
  };
  onNavigateToDetail?: (type: string, id: string) => void;
}

export const DrillDownModal: React.FC<DrillDownModalProps> = ({
  isOpen,
  onClose,
  initialData,
  onNavigateToDetail
}) => {
  const [drillDownPath, setDrillDownPath] = useState<DrillDownPath>({
    levels: [],
    currentLevel: 0
  });
  const [currentData, setCurrentData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Initialize drill-down path
  useEffect(() => {
    if (isOpen && initialData) {
      const initialLevel: DrillDownLevel = {
        id: initialData.value,
        title: initialData.label,
        type: initialData.type as any,
        data: initialData.data
      };

      setDrillDownPath({
        levels: [initialLevel],
        currentLevel: 0
      });
      setCurrentData(initialData.data);
    }
  }, [isOpen, initialData]);

  // Navigate to a specific level
  const navigateToLevel = (levelIndex: number) => {
    if (levelIndex >= 0 && levelIndex < drillDownPath.levels.length) {
      setDrillDownPath(prev => ({
        ...prev,
        currentLevel: levelIndex
      }));
      setCurrentData(drillDownPath.levels[levelIndex].data);
    }
  };

  // Drill down to next level
  const drillDown = async (item: any, nextType: DrillDownLevel['type']) => {
    setLoading(true);
    try {
      // In a real implementation, this would make an API call
      // For now, we'll simulate drill-down data
      let nextData: any[] = [];
      let nextTitle = '';

      switch (nextType) {
        case 'user':
          nextTitle = `Users in ${item.name || item.department}`;
          nextData = [
            { id: '1', username: 'john.doe', email: 'john@example.com', assigned_count: 5 },
            { id: '2', username: 'jane.smith', email: 'jane@example.com', assigned_count: 3 }
          ];
          break;
        case 'finding':
          nextTitle = `Findings for ${item.username || item.name}`;
          nextData = [
            { 
              id: '1', 
              title: 'Security Vulnerability Found', 
              status: 'In_Progress', 
              created_at: '2025-07-10',
              risk_level: 'High'
            },
            { 
              id: '2', 
              title: 'Compliance Gap Identified', 
              status: 'Pending', 
              created_at: '2025-07-09',
              risk_level: 'Medium'
            }
          ];
          break;
        case 'actionplan':
          nextTitle = `Action Plans for Finding: ${item.title}`;
          nextData = [
            {
              id: '1',
              action_plan: 'Implement security patches',
              status: 'In Progress',
              due_date: '2025-07-20',
              responsible_person: 'John Doe'
            }
          ];
          break;
        default:
          nextData = [];
      }

      const newLevel: DrillDownLevel = {
        id: item.id || item.value,
        title: nextTitle,
        type: nextType,
        data: nextData
      };

      setDrillDownPath(prev => ({
        levels: [...prev.levels, newLevel],
        currentLevel: prev.levels.length
      }));
      setCurrentData(nextData);
    } catch (error) {
      console.error('Error drilling down:', error);
    } finally {
      setLoading(false);
    }
  };

  // Render data table based on current level type
  const renderDataTable = () => {
    const currentLevel = drillDownPath.levels[drillDownPath.currentLevel];
    if (!currentLevel) return null;

    switch (currentLevel.type) {
      case 'department':
        return (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Department</TableHead>
                <TableHead>Finding Count</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentData.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{item.department || item.name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{item.count}</Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => drillDown(item, 'user')}
                    >
                      View Users
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        );

      case 'user':
        return (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Assigned Findings</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentData.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      {item.username}
                    </div>
                  </TableCell>
                  <TableCell>{item.email}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{item.assigned_count}</Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => drillDown(item, 'finding')}
                    >
                      View Findings
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        );

      case 'finding':
        return (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Finding</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Risk Level</TableHead>
                <TableHead>Created Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentData.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      {item.title}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={item.status === 'Resolved' ? 'default' : 'secondary'}>
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={item.risk_level === 'High' ? 'destructive' : 'secondary'}>
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      {item.risk_level}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(item.created_at).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => drillDown(item, 'actionplan')}
                      >
                        View Action Plans
                      </Button>
                      {onNavigateToDetail && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onNavigateToDetail('finding', item.id)}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        );

      case 'actionplan':
        return (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Action Plan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Responsible Person</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentData.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{item.action_plan}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{item.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(item.due_date).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>{item.responsible_person}</TableCell>
                  <TableCell>
                    {onNavigateToDetail && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onNavigateToDetail('actionplan', item.id)}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        );

      default:
        return <div>No data available</div>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="mr-2"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            Drill-Down Analysis
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Breadcrumb Navigation */}
          <Card>
            <CardContent className="p-4">
              <Breadcrumb>
                <BreadcrumbList>
                  {drillDownPath.levels.map((level, index) => (
                    <React.Fragment key={level.id}>
                      {index > 0 && <BreadcrumbSeparator />}
                      <BreadcrumbItem>
                        {index === drillDownPath.currentLevel ? (
                          <BreadcrumbPage>{level.title}</BreadcrumbPage>
                        ) : (
                          <BreadcrumbLink
                            className="cursor-pointer"
                            onClick={() => navigateToLevel(index)}
                          >
                            {level.title}
                          </BreadcrumbLink>
                        )}
                      </BreadcrumbItem>
                    </React.Fragment>
                  ))}
                </BreadcrumbList>
              </Breadcrumb>
            </CardContent>
          </Card>

          {/* Data Display */}
          <Card>
            <CardHeader>
              <CardTitle>
                {drillDownPath.levels[drillDownPath.currentLevel]?.title || 'Data'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center p-8">
                  <div className="text-muted-foreground">Loading...</div>
                </div>
              ) : (
                renderDataTable()
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DrillDownModal;
