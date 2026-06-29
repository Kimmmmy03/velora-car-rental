# Velora — Use Case Diagram

Actors and their interactions with the Velora luxury car rental system.

```mermaid
flowchart LR
    %% Actors
    Customer(("👤 Customer"))
    Admin(("👤 Admin"))

    %% System boundary
    subgraph Velora["Velora Car Rental System"]
        direction TB

        subgraph Auth["Authentication"]
            UC1(["Register Account"])
            UC2(["Login"])
            UC3(["Logout"])
        end

        subgraph Browse["Browse & Discover"]
            UC4(["Browse Fleet"])
            UC5(["Filter / Search Cars"])
            UC6(["View Car Details"])
            UC7(["View Car Reviews"])
        end

        subgraph Booking["Booking Management"]
            UC8(["Book a Car"])
            UC9(["View My Bookings"])
            UC10(["Cancel Pending Booking"])
            UC11(["Submit Review"])
        end

        subgraph AdminFleet["Fleet Administration"]
            UC12(["Add Car"])
            UC13(["Edit Car"])
            UC14(["Delete Car"])
            UC15(["Manage Categories"])
        end

        subgraph AdminBookings["Booking Administration"]
            UC16(["View All Bookings"])
            UC17(["Approve Booking"])
            UC18(["Reject Booking"])
            UC19(["Mark Booking Returned"])
            UC20(["View Dashboard Stats"])
        end
    end

    %% Customer associations
    Customer --- UC1
    Customer --- UC2
    Customer --- UC3
    Customer --- UC4
    Customer --- UC5
    Customer --- UC6
    Customer --- UC7
    Customer --- UC8
    Customer --- UC9
    Customer --- UC10
    Customer --- UC11

    %% Admin associations
    Admin --- UC2
    Admin --- UC3
    Admin --- UC12
    Admin --- UC13
    Admin --- UC14
    Admin --- UC15
    Admin --- UC16
    Admin --- UC17
    Admin --- UC18
    Admin --- UC19
    Admin --- UC20

    %% Include / extend relationships
    UC8 -. include .-> UC2
    UC9 -. include .-> UC2
    UC10 -. include .-> UC9
    UC11 -. extend .-> UC9
    UC17 -. include .-> UC16
    UC18 -. include .-> UC16
    UC19 -. include .-> UC16

    %% Styling
    classDef actor fill:#c8a97e,stroke:#8b6f47,stroke-width:2px,color:#1a1a1a
    classDef usecase fill:#1f2937,stroke:#c8a97e,stroke-width:1px,color:#e5e7eb
    class Customer,Admin actor
    class UC1,UC2,UC3,UC4,UC5,UC6,UC7,UC8,UC9,UC10,UC11,UC12,UC13,UC14,UC15,UC16,UC17,UC18,UC19,UC20 usecase
```

## Actor Summary

| Actor | Role | Access |
|-------|------|--------|
| **Customer** | End user renting vehicles | Public routes + `/`, `/booking/:carId`, `/my-bookings` |
| **Admin** | System operator | `/admin`, `/admin/bookings` |

## Business Rules Reflected

- Registration is open only to customers; admin accounts are pre-provisioned.
- A customer may cancel a booking **only while it is `PENDING`**. Once approved, only an admin can transition it (to `RETURNED` or terminal states).
- A review can be submitted **only after a booking reaches `RETURNED`** and only once per booking.
- Booking state machine: `PENDING → APPROVED → RETURNED`, with `REJECTED` / `CANCELLED` as terminal alternatives. Car status mirrors this: `RESERVED → RENTED → AVAILABLE`.
