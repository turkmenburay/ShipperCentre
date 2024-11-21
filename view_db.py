import sqlite3

# Connect to the SQLite database
conn = sqlite3.connect('shipment.db')

# Create a cursor object
cursor = conn.cursor()

# Execute a query to select all rows from the companies table
cursor.execute("SELECT * FROM companies")

# Fetch all rows from the query
rows = cursor.fetchall()

# Print the rows
for row in rows:
    print(row)

# Close the connection
conn.close()
