// Mock floor plan. `position` is a percentage of the floor-plan box.
export function getTables() {
  return [
    { id: '1', number: 1, seats: 2, type: 'window', position: { x: 10, y: 10 }, isAvailable: true, isRecommended: true },
    { id: '2', number: 2, seats: 4, type: 'center', position: { x: 30, y: 15 }, isAvailable: true },
    { id: '3', number: 3, seats: 2, type: 'corner', position: { x: 60, y: 10 }, isAvailable: false },
    { id: '4', number: 4, seats: 6, type: 'family', position: { x: 15, y: 40 }, isAvailable: true, isRecommended: true },
    { id: '5', number: 5, seats: 4, type: 'center', position: { x: 45, y: 35 }, isAvailable: true },
    { id: '6', number: 6, seats: 2, type: 'bar', position: { x: 70, y: 40 }, isAvailable: true },
    { id: '7', number: 7, seats: 8, type: 'private', position: { x: 25, y: 65 }, isAvailable: true, isRecommended: true },
    { id: '8', number: 8, seats: 4, type: 'patio', position: { x: 55, y: 70 }, isAvailable: true },
  ];
}
