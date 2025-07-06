import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';

const app = express();
app.use(cors());

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'parcelease',
});

// ✅ GET /api/users with bookings count
app.get('/api/users', async (req, res) => {
  try {
    const [users] = await db.query(`
      SELECT 
        u.id, 
        u.name, 
        u.email, 
        u.phone, 
        u.created_at,
        COUNT(p.user_id) AS bookingsCount
      FROM users u
      LEFT JOIN parcels p ON u.id = p.user_id
      GROUP BY u.id
      ORDER BY u.created_at DESC
    `);

    res.json(users);
  } catch (error) {
    console.error('Database query failed:', error);
    res.status(500).json({ error: 'Database query failed' });
  }
});

// ✅ DELETE /api/users/:id
app.delete('/api/users/:id', async (req, res) => {
  const userId = req.params.id;

  try {
    await db.query('DELETE FROM parcels WHERE user_id = ?', [userId]);
    const [result] = await db.query('DELETE FROM users WHERE id = ?', [userId]);

    if (result.affectedRows > 0) {
      res.json({ success: true, message: 'User deleted successfully' });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Failed to delete user:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// ✅ GET /api/bookings — Fetch booking details from parcels
app.get('/api/bookings', async (req, res) => {
  try {
    const [bookings] = await db.query(`
      SELECT 
        parcel_id,
        user_id,
        pickup_location,
        drop_location,
        deliverytype,
        created_at,
        status
      FROM parcels
      ORDER BY created_at DESC
    `);

    res.json(bookings);
  } catch (error) {
    console.error('Failed to fetch bookings:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});
// ✅ GET /api/support-tickets
app.get('/api/support-tickets', async (req, res) => {
  try {
    const [tickets] = await db.query(`
      SELECT 
        id,
        user_id,
        subject,
        message,
        response,
        status,
        created_at
      FROM support_requests
      ORDER BY created_at DESC
    `);

    res.json(tickets);
  } catch (error) {
    console.error('Failed to fetch support tickets:', error);
    res.status(500).json({ error: 'Failed to fetch support tickets' });
  }
});

// ✅ DELETE /api/support-tickets/:id
app.delete('/api/support-tickets/:id', async (req, res) => {
  const ticketId = req.params.id;

  try {
    const [result] = await db.query(
      'DELETE FROM supporttickets WHERE id = ?',
      [ticketId]
    );

    if (result.affectedRows > 0) {
      res.json({ success: true, message: 'Ticket deleted successfully' });
    } else {
      res.status(404).json({ error: 'Ticket not found' });
    }
  } catch (error) {
    console.error('Failed to delete support ticket:', error);
    res.status(500).json({ error: 'Failed to delete support ticket' });
  }
});
import { format, subDays, startOfWeek, endOfWeek } from 'date-fns';

// ✅ get /api/dashboard/revenue

app.get('/api/dashboard/revenue', async (req, res) => {
  const labels = Array.from({ length: 7 }, (_, i) =>
    format(subDays(new Date(), 6 - i), 'MMM dd')
  );

  try {
    const today = new Date();
    const thisWeekStart = startOfWeek(today, { weekStartsOn: 1 }); // Monday
    const lastWeekStart = subDays(thisWeekStart, 7);
    const lastWeekEnd = subDays(thisWeekStart, 1);

    const getDailyRevenue = async (startDate, endDate) => {
      const [rows] = await db.query(`
        SELECT DATE(created_at) as day, SUM(amount) as revenue
        FROM parcels
        WHERE created_at BETWEEN ? AND ?
        GROUP BY day
      `, [startDate, endDate]);

      const map = new Map(rows.map(r => [format(new Date(r.day), 'MMM dd'), r.revenue]));
      return labels.map(label => map.get(label) || 0);
    };

    const thisWeekData = await getDailyRevenue(thisWeekStart, today);
    const lastWeekData = await getDailyRevenue(lastWeekStart, lastWeekEnd);

    res.json({
      labels,
      datasets: [
        {
          label: 'This Week',
          data: thisWeekData,
          borderColor: '#0066FF',
          backgroundColor: 'rgba(0, 102, 255, 0.1)',
        },
        {
          label: 'Last Week',
          data: lastWeekData,
          borderColor: '#d4dbe6',
          backgroundColor: 'rgba(212, 219, 230, 0.1)',
        },
      ],
    });
  } catch (error) {
    console.error('Failed to fetch revenue data:', error);
    res.status(500).json({ error: 'Failed to fetch revenue data' });
  }
});

app.get('/api/dashboard/kpis', async (req, res) => {
  try {
    const [bookings] = await db.query(`
      SELECT COUNT(*) as totalBookings
      FROM parcels
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
    `);

    const [revenue] = await db.query(`
      SELECT SUM(amount) as totalRevenue
      FROM parcels
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
    `);

    const [deliveries] = await db.query(`
      SELECT COUNT(*) as activeDeliveries
      FROM tracking
      WHERE status = 'In Transit'
    `);

    const [tickets] = await db.query(`
      SELECT COUNT(*) as openTickets
      FROM support_requests
      WHERE status = 'Pending'

    `);

    res.json([
      {
        title: 'Total Bookings',
        value: bookings[0].totalBookings.toLocaleString(),
        icon: 'Package',
        change: { value: 12.5, type: 'increase' }, // Optional: compute dynamically
        tooltipText: 'Total number of bookings in the last 30 days',
      },
      {
        title: 'Revenue',
        value: `$${(revenue[0].totalRevenue || 0).toLocaleString()}`,
        icon: 'DollarSign',
        change: { value: 8.3, type: 'increase' },
        tooltipText: 'Total revenue generated in the last 30 days',
      },
      {
        title: 'Active Deliveries',
        value: deliveries[0].activeDeliveries.toString(),
        icon: 'Truck',
        change: { value: 2.1, type: 'decrease' },
        tooltipText: 'Number of packages currently in transit',
      },
      {
        title: 'Open Tickets',
        value: tickets[0].openTickets.toString(),
        icon: 'LifeBuoy',
        change: { value: 5.4, type: 'decrease' },
        tooltipText: 'Number of unresolved support tickets',
      },
    ]);
  } catch (error) {
    console.error('Failed to fetch KPI data:', error);
    res.status(500).json({ error: 'Failed to fetch KPI data' });
  }
});
// GET all payments
// GET /api/payments - fetch all payment transactions
app.get('/api/payments', async (req, res) => {
  try {
    const [payments] = await db.query(`
      SELECT 
        id,
        user_id,
        parcel_id,
        amount,
        payment_method,
        payment_status,
        transaction_id,
        created_at
      FROM payments
      ORDER BY created_at DESC
    `);
    res.json(payments);
  } catch (error) {
    console.error('Failed to fetch payments:', error);
    res.status(500).json({ error: 'Failed to fetch payments' });
  }
});

// GET payment by id (optional)
app.get('/api/payments/:id', async (req, res) => {
  const paymentId = req.params.id;
  try {
    const [payments] = await db.query('SELECT * FROM payments WHERE id = ?', [paymentId]);
    if (payments.length === 0) return res.status(404).json({ error: 'Payment not found' });
    res.json(payments[0]);
  } catch (error) {
    console.error('Failed to fetch payment:', error);
    res.status(500).json({ error: 'Failed to fetch payment' });
  }
});

// POST new payment (optional, if you want to add payments from API)
app.use(express.json());
app.post('/api/paymentsadd', async (req, res) => {
  const { user_id, parcel_id, amount, payment_method, payment_status, transaction_id } = req.body;
  try {
    const [result] = await db.query(
      `INSERT INTO payments (user_id, parcel_id, amount, payment_method, payment_status, transaction_id) VALUES (?, ?, ?, ?, ?, ?)`,
      [user_id, parcel_id, amount, payment_method, payment_status, transaction_id]
    );
    res.status(201).json({ id: result.insertId });
  } catch (error) {
    console.error('Failed to create payment:', error);
    res.status(500).json({ error: 'Failed to create payment' });
  }
});
// ✅ GET /api/faqs — Fetch FAQ list
app.get('/api/faqs', async (req, res) => {
  try {
    const [faqs] = await db.query(`
      SELECT 
        id,
        question,
        answer,
        created_at
      FROM faqs
      ORDER BY created_at DESC
    `);

    res.json(faqs);
  } catch (error) {
    console.error('Failed to fetch FAQs:', error);
    res.status(500).json({ error: 'Failed to fetch FAQs' });
  }
});
// ✅ PUT /api/bookings/:id/cancel - Mark a booking as cancelled
app.put('/api/bookings/:id/cancel', async (req, res) => {
  const parcelId = req.params.id;

  try {
    const [result] = await db.query(
      'UPDATE parcels SET status = ? WHERE parcel_id = ?',
      ['cancelled', parcelId]
    );

    if (result.affectedRows > 0) {
      res.json({ success: true, message: 'Booking cancelled successfully' });
    } else {
      res.status(404).json({ error: 'Booking not found' });
    }
  } catch (error) {
    console.error('Failed to cancel booking:', error);
    res.status(500).json({ error: 'Failed to cancel booking' });
  }
});
// PUT /api/bookings/:id/confirm
app.put('/api/bookings/:id/confirm', async (req, res) => {
  const { id } = req.params;

  try {
    await db.query('UPDATE parcels SET status = ? WHERE parcel_id = ?', ['Confirmed', id]);
    res.json({ success: true, message: 'Booking confirmed' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to confirm booking' });
  }
});


app.get('/api/incity-bookings', async (req, res) => {
  try {
    const [results] = await db.query(`
      SELECT 
        parcel_id,
        sender_name,
        pickup_location,
        delivery_time,
        amount,
        status,
        created_at
      FROM incitybookings
      ORDER BY created_at DESC
      LIMIT 50
    `);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch incity bookings' });
  }
});
// Route to insert tracking update

// ✅ GET /api/parcel_timeline/:parcel_id — get tracking updates for one parcel
app.get('/api/parcel_timeline/:parcel_id', async (req, res) => {
  const parcelId = req.params.parcel_id;
  try {
    const [rows] = await db.query(
      'SELECT * FROM parcel_timeline WHERE parcel_id = ? ORDER BY timestamp DESC',
      [parcelId]
    );
    res.json(rows);
  } catch (err) {
    console.error('Error fetching timeline:', err);
    res.status(500).json({ message: 'Error fetching timeline' });
  }
});
// GET parcel details by parcel ID
app.get('/api/parcel/:parcelId', async (req, res) => {
  const { parcelId } = req.params;
  try {
    const [rows] = await db.query(
      'SELECT * FROM parcels WHERE parcel_id = ?',
      [parcelId]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Parcel not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Failed to fetch parcel:', error);
    res.status(500).json({ error: 'Failed to fetch parcel' });
  }
});

// POST add new tracking update for a parcel
app.post('/api/parcel_timeline', async (req, res) => {
  const { parcel_id, status, location } = req.body;

  if (!parcel_id || !status || !location) {
    return res.status(400).json({ error: 'parcel_id, status, and location are required' });
  }

  try {
    // Check if the parcel_id already exists
    const [rows] = await db.query("SELECT * FROM parcel_timeline WHERE parcel_id = ?", [parcel_id]);

    if (rows.length > 0) {
      // If exists, append new location to existing one
      const existingLocation = rows[0].location || '';
      const updatedLocation = existingLocation
        ? `${existingLocation} → ${location}`
        : location;

      await db.query(
        "UPDATE parcel_timeline SET location = ?, status = ?, timestamp = NOW() WHERE parcel_id = ?",
        [updatedLocation, status, parcel_id]
      );

      return res.json({ message: "Tracking updated (appended) successfully" });
    } else {
      // Else insert new
      await db.query(
        "INSERT INTO parcel_timeline (parcel_id, status, location, timestamp) VALUES (?, ?, ?, NOW())",
        [parcel_id, status, location]
      );

      return res.json({ message: "Tracking added successfully" });
    }
  } catch (error) {
    console.error("Tracking update error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});







const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
