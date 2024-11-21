from flask import Flask, jsonify, request, render_template
import sqlite3

app = Flask(__name__)

# Route to render the index page
@app.route('/')
def index():
    return render_template('index.html')

# Route to render the comparison page
@app.route('/comparison')
def comparison():
    return render_template('comparison.html')

# API endpoint to get shipping companies
@app.route('/api/companies', methods=['GET'])
def get_companies():
    origin = request.args.get('origin')
    destination = request.args.get('destination')
    company = request.args.get('company')

    # Connect to the SQLite database
    conn = sqlite3.connect('shipment.db')
    cursor = conn.cursor()

    # Construct the base SQL query
    query = "SELECT * FROM companies WHERE 1=1"
    params = []

    # Add filters to the query
    if origin:
        query += " AND origin_country = ?"
        params.append(origin)
    if destination:
        query += " AND destination_country = ?"
        params.append(destination)
    if company:
        query += " AND name = ?"
        params.append(company)

    cursor.execute(query, params)
    rows = cursor.fetchall()
    conn.close()

    # Convert rows to a list of dictionaries
    companies = []
    for row in rows:
        companies.append({
            'id': row[0],
            'name': row[1],
            'logo_url': row[2],
            'origin_country': row[3],
            'destination_country': row[4],
            'delivery_days': row[5],
            'service_type': row[6],
            'price': row[7],
            'rating': row[8],
            'website_url': row[9]
        })

    return jsonify(companies)


# API endpoint to get distinct origin and destination countries
@app.route('/api/countries', methods=['GET'])
def get_countries():
    # Connect to the SQLite database
    conn = sqlite3.connect('shipment.db')
    cursor = conn.cursor()

    # Get distinct origin countries
    cursor.execute("SELECT DISTINCT origin_country FROM companies")
    origins = [row[0] for row in cursor.fetchall()]

    # Get distinct destination countries
    cursor.execute("SELECT DISTINCT destination_country FROM companies")
    destinations = [row[0] for row in cursor.fetchall()]

    conn.close()

    return jsonify({'origins': origins, 'destinations': destinations})

if __name__ == '__main__':
    app.run(debug=True)
