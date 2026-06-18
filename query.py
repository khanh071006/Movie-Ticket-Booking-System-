import psycopg2
conn = psycopg2.connect(dbname='movie_booking_db', user='postgres', password='', host='localhost')
cur = conn.cursor()
cur.execute("SELECT id, name FROM cinemas;")
print("Cinemas:", cur.fetchall())
cur.execute("SELECT email, cinema_id FROM accounts WHERE email = 'khanh@gmail.com';")
print("User khanh@gmail.com:", cur.fetchall())
cur.execute("SELECT id, showing_id FROM bookings WHERE id = 'a22588dc-5b24-484e-bf06-2ff3da2e6013';")
booking = cur.fetchone()
print("Booking:", booking)
if booking:
    cur.execute("SELECT room_id FROM showtimes WHERE id = %s;", (booking[1],))
    room_id = cur.fetchone()[0]
    cur.execute("SELECT cinema_id FROM rooms WHERE id = %s;", (room_id,))
    print("Booking cinema_id:", cur.fetchone()[0])
conn.close()
