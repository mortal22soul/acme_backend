import { OpenAPIHono } from "@hono/zod-openapi";
import {
  createBooking,
  deleteBooking,
  updateBooking,
  getBookingById,
  getAllBookings,
} from "@/routes/bookings/routes.ts";
import { db } from "@/db/index.ts";
import { bookings } from "@/db/schema/bookings.ts";
import { eq } from "drizzle-orm";

const bookingRouter = new OpenAPIHono();

bookingRouter.openapi(getAllBookings, async (c) => {
  const bookingList = await db.select().from(bookings);
  return c.json(bookingList);
});

bookingRouter.openapi(getBookingById, async (c) => {
  const id = c.req.param("id");

  const booking = await db
    .select()
    .from(bookings)
    .where(eq(bookings.id, Number(id)));
  return c.json(booking);
});

bookingRouter.openapi(createBooking, async (c) => {
  const booking = await c.req.json();
  await db.insert(bookings).values(booking);
  return c.text("Booking created successfully");
});

bookingRouter.openapi(updateBooking, async (c) => {
  const id = c.req.param("id");
  const booking = await c.req.json();

  await db
    .update(bookings)
    .set(booking)
    .where(eq(bookings.id, Number(id)));

  return c.text("Booking updated successfully");
});

bookingRouter.openapi(deleteBooking, async (c) => {
  const id = c.req.param("id");

  await db.delete(bookings).where(eq(bookings.id, Number(id)));
  return c.text("Booking deleted successfully");
});

export default bookingRouter;
