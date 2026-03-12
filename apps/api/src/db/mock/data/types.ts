export interface MockEquipmentType {
  equipmentTypeID: number;
  customerID: number;
  equipmentTypeName: string;
  categorySlug: string;
  description: string | null;
  isActive: boolean;
  sortOrder: number;
}

export const mockEquipmentTypes: MockEquipmentType[] = [
  { equipmentTypeID: 1, customerID: 1, equipmentTypeName: "Rooftop Unit (RTU)", categorySlug: "hvac", description: "Packaged rooftop HVAC unit", isActive: true, sortOrder: 1 },
  { equipmentTypeID: 2, customerID: 1, equipmentTypeName: "Split System", categorySlug: "hvac", description: "Split AC/heat pump system", isActive: true, sortOrder: 2 },
  { equipmentTypeID: 3, customerID: 1, equipmentTypeName: "Boiler", categorySlug: "hvac", description: "Hot water or steam boiler", isActive: true, sortOrder: 3 },
  { equipmentTypeID: 4, customerID: 1, equipmentTypeName: "Standby Generator", categorySlug: "electrical", description: "Emergency backup power generator", isActive: true, sortOrder: 4 },
  { equipmentTypeID: 5, customerID: 1, equipmentTypeName: "Electrical Panel", categorySlug: "electrical", description: "Main or sub electrical distribution panel", isActive: true, sortOrder: 5 },
  { equipmentTypeID: 6, customerID: 1, equipmentTypeName: "Water Heater", categorySlug: "plumbing", description: "Commercial water heater", isActive: true, sortOrder: 6 },
  { equipmentTypeID: 7, customerID: 1, equipmentTypeName: "Fire Alarm Panel", categorySlug: "fire-safety", description: "Addressable fire alarm control panel", isActive: true, sortOrder: 7 },
  { equipmentTypeID: 8, customerID: 1, equipmentTypeName: "Elevator", categorySlug: "structural", description: "Passenger or freight elevator", isActive: true, sortOrder: 8 },
  { equipmentTypeID: 9, customerID: 1, equipmentTypeName: "Irrigation Controller", categorySlug: "grounds", description: "Automatic landscape irrigation controller", isActive: true, sortOrder: 9 },
  { equipmentTypeID: 10, customerID: 1, equipmentTypeName: "Fuel Dispenser", categorySlug: "electrical", description: "Gas station fuel dispensing unit", isActive: true, sortOrder: 10 },
];
