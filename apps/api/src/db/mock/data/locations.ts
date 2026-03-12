export interface MockProperty {
  propertyID: number;
  customerID: number;
  propertyName: string;
  propertyAddress: string;
  propertyCity: string;
  propertyState: string;
  propertyZip: string;
  isActive: boolean;
}

export interface MockLocation {
  assetLocationID: number;
  customerID: number;
  propertyID: number;
  locationName: string;
  locationDescription: string | null;
  buildingName: string | null;
  floorLevel: string | null;
  roomNumber: string | null;
  isActive: boolean;
}

export const mockProperties: MockProperty[] = [
  {
    propertyID: 1,
    customerID: 1,
    propertyName: "Lincoln High School",
    propertyAddress: "1234 Oak Avenue",
    propertyCity: "San Jose",
    propertyState: "CA",
    propertyZip: "95112",
    isActive: true,
  },
  {
    propertyID: 2,
    customerID: 1,
    propertyName: "Washington Elementary",
    propertyAddress: "567 Elm Street",
    propertyCity: "San Jose",
    propertyState: "CA",
    propertyZip: "95125",
    isActive: true,
  },
  {
    propertyID: 3,
    customerID: 1,
    propertyName: "District Maintenance Yard",
    propertyAddress: "890 Industrial Blvd",
    propertyCity: "San Jose",
    propertyState: "CA",
    propertyZip: "95131",
    isActive: true,
  },
  {
    propertyID: 4,
    customerID: 1,
    propertyName: "Roosevelt Middle School",
    propertyAddress: "2100 Maple Drive",
    propertyCity: "Campbell",
    propertyState: "CA",
    propertyZip: "95008",
    isActive: true,
  },
  {
    propertyID: 5,
    customerID: 1,
    propertyName: "District Office",
    propertyAddress: "300 Main Street",
    propertyCity: "San Jose",
    propertyState: "CA",
    propertyZip: "95110",
    isActive: true,
  },
];

export const mockLocations: MockLocation[] = [
  // Lincoln High School
  { assetLocationID: 1, customerID: 1, propertyID: 1, locationName: "Main Building - Mechanical Room", locationDescription: "Primary mechanical room housing HVAC and plumbing equipment", buildingName: "Main Building", floorLevel: "B1", roomNumber: "B101", isActive: true },
  { assetLocationID: 2, customerID: 1, propertyID: 1, locationName: "Main Building - Electrical Room", locationDescription: "Main electrical distribution room", buildingName: "Main Building", floorLevel: "1", roomNumber: "108", isActive: true },
  { assetLocationID: 3, customerID: 1, propertyID: 1, locationName: "Gymnasium - Roof", locationDescription: "Gymnasium rooftop with HVAC units", buildingName: "Gymnasium", floorLevel: "Roof", roomNumber: null, isActive: true },
  { assetLocationID: 4, customerID: 1, propertyID: 1, locationName: "Science Wing - Lab 201", locationDescription: "Chemistry lab with fume hoods", buildingName: "Science Wing", floorLevel: "2", roomNumber: "201", isActive: true },

  // Washington Elementary
  { assetLocationID: 5, customerID: 1, propertyID: 2, locationName: "Admin Building - Boiler Room", locationDescription: "Central boiler and hot water system", buildingName: "Admin Building", floorLevel: "B1", roomNumber: "B01", isActive: true },
  { assetLocationID: 6, customerID: 1, propertyID: 2, locationName: "Cafeteria - Kitchen", locationDescription: "Commercial kitchen with hood and suppression system", buildingName: "Cafeteria", floorLevel: "1", roomNumber: "K01", isActive: true },
  { assetLocationID: 7, customerID: 1, propertyID: 2, locationName: "Portable P-3", locationDescription: "Portable classroom unit", buildingName: "Portable P-3", floorLevel: "1", roomNumber: null, isActive: true },

  // District Maintenance Yard
  { assetLocationID: 8, customerID: 1, propertyID: 3, locationName: "Workshop A", locationDescription: "General maintenance workshop", buildingName: "Shop Building", floorLevel: "1", roomNumber: "A", isActive: true },
  { assetLocationID: 9, customerID: 1, propertyID: 3, locationName: "Generator Pad", locationDescription: "Outdoor generator installation", buildingName: null, floorLevel: null, roomNumber: null, isActive: true },
  { assetLocationID: 10, customerID: 1, propertyID: 3, locationName: "Storage Warehouse", locationDescription: "Parts and equipment storage", buildingName: "Warehouse", floorLevel: "1", roomNumber: null, isActive: true },

  // Roosevelt Middle School
  { assetLocationID: 11, customerID: 1, propertyID: 4, locationName: "Main Office - Server Room", locationDescription: "IT and fire panel room", buildingName: "Main Office", floorLevel: "1", roomNumber: "102", isActive: true },
  { assetLocationID: 12, customerID: 1, propertyID: 4, locationName: "Building B - Roof", locationDescription: "Rooftop HVAC units", buildingName: "Building B", floorLevel: "Roof", roomNumber: null, isActive: true },
  { assetLocationID: 13, customerID: 1, propertyID: 4, locationName: "Multipurpose Room", locationDescription: "Large assembly and events room", buildingName: "Building A", floorLevel: "1", roomNumber: "MPR", isActive: true },

  // District Office
  { assetLocationID: 14, customerID: 1, propertyID: 5, locationName: "Executive Floor - Mechanical", locationDescription: "3rd floor mechanical closet", buildingName: "Main Tower", floorLevel: "3", roomNumber: "M301", isActive: true },
  { assetLocationID: 15, customerID: 1, propertyID: 5, locationName: "Parking Garage - Level 1", locationDescription: "Underground parking electrical", buildingName: "Parking Garage", floorLevel: "P1", roomNumber: null, isActive: true },
  { assetLocationID: 16, customerID: 1, propertyID: 5, locationName: "Lobby", locationDescription: "Main entrance and lobby area", buildingName: "Main Tower", floorLevel: "1", roomNumber: "L01", isActive: true },
];
