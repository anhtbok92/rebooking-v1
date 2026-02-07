# DOCTOR Role Implementation

## Overview
Added DOCTOR role to the system with same permissions as STAFF plus ability to view patient information. This role is designed for medical professionals who need to access patient data and manage appointments.

## Changes Made

### 1. Core Role Definition
**File: `lib/rbac.ts`**
- Added `DOCTOR` to `UserRole` type
- Set hierarchy level 3 (same as STAFF)
- Permissions: `view_bookings`, `update_booking_status`, `view_services`, `view_patients`
- Label: "Bác sĩ" (Vietnamese for Doctor)

### 2. Validation Schemas
**File: `lib/validations/schemas.ts`**
- Updated `getUserQuerySchema` to include DOCTOR role filter
- Updated `registerUserSchema` to accept DOCTOR role
- Updated `updateUserSchema` to accept DOCTOR role

### 3. Current User Utilities
**Files: `lib/currentUserClient.ts`, `lib/currentUserServer.ts`**
- Added `DOCTOR` to UserRole type
- Added `isDoctor` boolean property to CurrentUser interface
- Added role check: `isDoctor: role === "DOCTOR"`

### 4. Middleware
**File: `middleware.ts`**
- Updated staff route protection to allow both STAFF and DOCTOR roles
- DOCTOR users can now access `/staff` routes

### 5. Admin Panel
**File: `components/admin/UserManagement.tsx`**
- Added DOCTOR to role filter dropdown
- Added DOCTOR to role selection dropdown when editing users
- Super Admin can assign DOCTOR role to users

### 6. SWR Hooks
**File: `lib/swr/hooks/users.ts`**
- Added `useDoctors()` hook to fetch all doctors
- Similar to `useStaff()` but filters by DOCTOR role

### 7. API Routes

#### Admin Users Route
**File: `app/api/v1/admin/users/route.ts`**
- Updated email subject to include "Doctor" label
- DOCTOR role can be created through POST endpoint

#### Doctors Endpoint (NEW)
**File: `app/api/v1/doctors/route.ts`**
- New public endpoint: `GET /api/v1/doctors`
- Returns list of all doctors with pagination
- Supports search by name or email
- Used for customer doctor selection

#### Bookings Stats Route
**File: `app/api/v1/bookings/stats/route.ts`**
- Added DOCTOR to authorized roles
- DOCTOR can view booking statistics

#### Receipt Route
**File: `app/api/v1/bookings/[id]/receipt/route.ts`**
- Added DOCTOR to authorized roles
- DOCTOR can generate receipts for bookings

#### Search Route
**File: `app/api/v1/search/route.ts`**
- Added DOCTOR to booking URL access check
- Admin can search for DOCTOR users
- DOCTOR users can access admin bookings page

### 8. Email Templates
**File: `lib/email-templates/roles.ts`**
- Updated `getAdminCreatedEmail()` to display "Bác sĩ" for DOCTOR role
- Added DOCTOR-specific permission: "View patient information"
- Updated `getRoleChangedEmail()` to handle DOCTOR role display

### 9. Translations
**Files: `messages/en.json`, `messages/vi.json`**
- Added DOCTOR role translation
  - English: "Doctor"
  - Vietnamese: "Bác sĩ"

## Usage

### Creating a Doctor User
1. Login as Super Admin
2. Go to Admin Panel → Users
3. Create new user or edit existing user
4. Select "Bác sĩ" (Doctor) role
5. User will receive email with credentials

### Fetching Doctors List
```typescript
// Using SWR hook
import { useDoctors } from "@/lib/swr/hooks/users"

function DoctorSelector() {
  const { data } = useDoctors({ page: 1, limit: 10 })
  const doctors = data?.doctors || []
  
  return (
    <select>
      {doctors.map(doctor => (
        <option key={doctor.id} value={doctor.id}>
          {doctor.name}
        </option>
      ))}
    </select>
  )
}

// Using API directly
const response = await fetch('/api/v1/doctors?page=1&limit=10')
const { doctors, pagination } = await response.json()
```

### Checking Doctor Role
```typescript
// Client-side
import currentUserClient from "@/lib/currentUserClient"

const user = currentUserClient()
if (user?.isDoctor) {
  // Show doctor-specific features
}

// Server-side
import currentUserServer from "@/lib/currentUserServer"

const user = await currentUserServer()
if (user?.isDoctor) {
  // Allow doctor-specific actions
}
```

## Permissions

### DOCTOR Role Permissions
- ✅ View bookings
- ✅ Update booking status
- ✅ View services
- ✅ View patients (unique to DOCTOR)
- ✅ Access staff routes
- ✅ Generate receipts
- ✅ View booking statistics
- ❌ Manage users (Admin only)
- ❌ Manage services (Admin only)
- ❌ System settings (Super Admin only)

## Next Steps (Optional)

1. **Add Doctor Selection to Booking Flow**
   - Update booking form to include doctor selection dropdown
   - Store selected doctor ID in booking record
   - Update Prisma schema to add `doctorId` field to Booking model

2. **Doctor Dashboard**
   - Create dedicated dashboard for doctors at `/staff/doctor`
   - Show assigned patients and appointments
   - Display patient history and notes

3. **Patient Management**
   - Create patient profile pages
   - Add medical notes and history
   - Track treatment progress

4. **Doctor Availability**
   - Add availability schedule for each doctor
   - Filter available time slots by selected doctor
   - Prevent double-booking

## Testing

To test the DOCTOR role:

1. Create a test doctor account through Admin Panel
2. Login with doctor credentials
3. Verify access to:
   - Staff routes (`/staff`)
   - Booking management
   - Receipt generation
   - Booking statistics
4. Verify restrictions:
   - Cannot access Super Admin routes
   - Cannot manage users (unless also Admin)
   - Cannot change system settings

## Database Note

The DOCTOR role uses the existing `role` enum in the Prisma schema. If you need to update the database enum, run:

```bash
npx prisma db push
```

Or create a migration:

```bash
npx prisma migrate dev --name add_doctor_role
```
