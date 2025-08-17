import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Employee {
  id: string;
  name: string;
  performance: number;
  potential: number;
}

interface NineBoxGridProps {
  employees: Employee[];
}

export default function NineBoxGrid({ employees }: NineBoxGridProps) {
  const getGridPosition = (performance: number, potential: number) => {
    const perfLevel = performance >= 80 ? 2 : performance >= 60 ? 1 : 0;
    const potLevel = potential >= 80 ? 2 : potential >= 60 ? 1 : 0;
    return { x: perfLevel, y: potLevel };
  };

  const getBoxLabel = (x: number, y: number) => {
    const labels = [
      ['Inconsistent Player', 'Core Player', 'High Performer'],
      ['Emerging Talent', 'Solid Performer', 'High Impact'],
      ['Future Star', 'Rising Star', 'Top Talent']
    ];
    return labels[y][x];
  };

  const getBoxColor = (x: number, y: number) => {
    if (x === 2 && y === 2) return 'bg-green-100 border-green-300';
    if (x === 2 || y === 2) return 'bg-blue-100 border-blue-300';
    if (x === 1 && y === 1) return 'bg-yellow-100 border-yellow-300';
    return 'bg-red-100 border-red-300';
  };

  const grid = Array(3).fill(null).map(() => Array(3).fill([]));
  
  employees.forEach(emp => {
    const pos = getGridPosition(emp.performance, emp.potential || 70);
    grid[pos.y][pos.x] = [...grid[pos.y][pos.x], emp];
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>9-Box Performance Grid</CardTitle>
        <p className="text-sm text-muted-foreground">
          Performance vs Potential matrix for talent assessment
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-2 h-96">
          {grid.map((row, y) => 
            row.map((employees, x) => (
              <div
                key={`${x}-${y}`}
                className={`border-2 rounded-lg p-3 ${getBoxColor(x, 2-y)} min-h-[120px]`}
              >
                <div className="text-xs font-medium mb-2">
                  {getBoxLabel(x, 2-y)}
                </div>
                <div className="space-y-1">
                  {employees.map((emp: Employee) => (
                    <div
                      key={emp.id}
                      className="text-xs bg-white/70 rounded px-2 py-1 truncate"
                      title={emp.name}
                    >
                      {emp.name}
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
        
        <div className="mt-4 flex justify-between text-xs text-muted-foreground">
          <span>← Lower Performance</span>
          <span>Higher Performance →</span>
        </div>
        <div className="flex justify-center mt-2">
          <div className="text-xs text-muted-foreground transform -rotate-90 origin-center">
            ← Lower Potential | Higher Potential →
          </div>
        </div>
      </CardContent>
    </Card>
  );
}