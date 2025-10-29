from flask import Flask, jsonify, render_template, redirect, session, url_for, request, flash
from flask_login import LoginManager, login_user, logout_user, login_required, UserMixin, current_user
import mysql.connector
import pymysql
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
app.secret_key = "your_secret_key_here"  # change this to something secure

def get_db_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",         # your MySQL user
        password="Sql@2025", # your MySQL password
        database="handmade_store"
    )

# ---------- MySQL Connection ----------
db = mysql.connector.connect(
    host="localhost",
    user="root",         # change to your MySQL user
    password="Sql@2025", # change to your MySQL password
    database="handmade_store"
)
cursor = db.cursor(dictionary=True)

# ---------- Flask-Login Setup ----------
login_manager = LoginManager()
login_manager.login_view = "login"
login_manager.init_app(app)

class User(UserMixin):
    def __init__(self, id, name, email, password_hash):
        self.id = id
        self.name = name
        self.email = email
        self.password_hash = password_hash

@login_manager.user_loader
def load_user(user_id):
    cursor.execute("SELECT * FROM users WHERE id=%s", (user_id,))
    user = cursor.fetchone()
    if user:
        return User(user["id"], user["name"], user["email"], user["password_hash"])
    return None

# ---------- Authentication ----------
@app.route("/", methods=["GET", "POST"])
def login():
    if current_user.is_authenticated:
        return redirect(url_for("index"))

    if request.method == "POST":
        email = request.form["email"]
        password = request.form["password"]
        cursor.execute("SELECT * FROM users WHERE email=%s", (email,))
        user = cursor.fetchone()
        if user and check_password_hash(user["password_hash"], password):
            login_user(User(user["id"], user["name"], user["email"], user["password_hash"]))
            return redirect(url_for("index"))
        else:
            flash("Invalid email or password", "danger")
    return render_template("login.html")

@app.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "POST":
        name = request.form["name"]
        email = request.form["email"]
        password = request.form["password"]
        password_hash = generate_password_hash(password)
        try:
            cursor.execute(
                "INSERT INTO users (name, email, password_hash) VALUES (%s, %s, %s)",
                (name, email, password_hash)
            )
            db.commit()
            flash("Registration successful! Please login.", "success")
            return redirect(url_for("login"))
        except:
            flash("Email already exists!", "danger")
    return render_template("register.html")

@app.route("/logout")
@login_required
def logout():
    logout_user()
    return redirect(url_for("login"))

# ---------- Profile ----------
@app.route("/profile")
@login_required
def profile():
    return render_template("profile.html", user=current_user)

@app.route("/edit-profile", methods=["GET", "POST"])
@login_required
def edit_profile():
    if request.method == "POST":
        username = request.form.get("username")
        email = request.form.get("email")
        password = request.form.get("password")
        if username:
            current_user.name = username
        if email:
            current_user.email = email
        if password:
            current_user.password_hash = generate_password_hash(password)
        flash("Profile updated successfully!", "success")
        return redirect(url_for("profile"))
    return render_template("edit_profile.html", user=current_user)

# ---------- Main Pages ----------
@app.route("/index")
@login_required
def index():
    return render_template("index.html")

@app.route("/about")
@login_required
def about():
    return render_template("about.html")

@app.route("/contact")
@login_required
def contact():
    return render_template("contact.html")

@app.route("/blog")
@login_required
def blog():
    return render_template("blog.html")

@app.route("/shop")
@login_required
def shop():
    return render_template("shop.html")

# ---------- Product Categories ----------
@app.route("/assorted-craft")
@login_required
def assorted_craft():
    return render_template("assorted-craft.html")

@app.route("/blue-pottery")
@login_required
def blue_pottery():
    return render_template("blue-pottery.html")

@app.route("/brass-craft")
@login_required
def brass_craft():
    return render_template("brass-craft.html")

@app.route("/crystal-craft")
@login_required
def crystal_craft():
    return render_template("crystal-craft.html")

@app.route("/furniture")
@login_required
def furniture():
    return render_template("furniture.html")

@app.route("/marble-handicrafts")
@login_required
def marble_handicrafts():
    return render_template("marble-handicrafts.html")

@app.route("/metal-craft")
@login_required
def metal_craft():
    return render_template("metal-craft.html")

@app.route("/painting")
@login_required
def painting():
    return render_template("painting.html")

@app.route("/wooden-handicrafts")
@login_required
def wooden_handicrafts():
    return render_template("wooden-handicrafts.html")

# ---------- Error ----------
@app.errorhandler(404)
def custom_404(e):
    return redirect(url_for("login"))

# ---------- Cart ----------
@app.route("/cart")
@login_required
def cart():
    cart = session.get("cart", [])
    total = sum(item["price"] * item["qty"] for item in cart)
    return render_template("cart.html", cart=cart, total=total)

@app.route("/add-to-cart/<product_name>", methods=["POST"])
@login_required
def add_to_cart(product_name):
    data = request.get_json() or {}
    try:
        price = float(data.get("price", 0.0))  # ✅ force convert to float
    except (ValueError, TypeError):
        price = 0.0

    image = data.get("image")

    cart = session.get("cart", [])

    # Normalize old items
    new_cart = []
    for item in cart:
        if isinstance(item, dict):
            # 🔥 ensure old items also have float price
            item["price"] = float(item.get("price", 0.0))
            new_cart.append(item)
        else:
            new_cart.append({"name": item, "price": 0.0, "qty": 1})
    cart = new_cart

    # Add/update product
    for item in cart:
        if item["name"] == product_name:
            item["qty"] += 1
            break
    else:
        cart.append({
            "name": product_name,
            "price": price,   # ✅ guaranteed float now
            "qty": 1,
            "image": image
        })

    session["cart"] = cart
    session.modified = True

    return jsonify({
        "success": True,
        "message": f"{product_name} added to cart!",
        "cart_count": sum(i["qty"] for i in cart)
    })



    
@app.route("/clear-cart")
@login_required
def clear_cart():
    session.pop("cart", None)
    flash("Cart cleared!", "info")
    return redirect(url_for("index"))


# ------------------------
# Checkout Route
# ------------------------
@app.route("/checkout", methods=["POST"])
@login_required
def checkout():
    cart = session.get("cart", [])
    selected_items = request.form.getlist("selected_items")  # list of indexes (strings)

    if not selected_items:
        flash("Please select at least one item to proceed!", "warning")
        return redirect(url_for("cart"))

    selected_items = [int(i) for i in selected_items]  # convert to int
    checkout_items = [cart[i] for i in selected_items if i < len(cart)]

    # Compute total for only selected items
    total = sum(item.get("price", 0) * item.get("qty", 1) for item in checkout_items)

    return render_template("checkout.html", cart=checkout_items, total=total)


@app.route("/remove_item/<int:product_index>", methods=["POST"])
@login_required
def remove_item(product_index):
    cart = session.get("cart", [])
    if 0 <= product_index < len(cart):
        removed_item = cart.pop(product_index)
        session["cart"] = cart
        flash(f"Removed {removed_item['name']} from cart", "success")
    else:
        flash("Invalid item selected", "danger")
    return redirect(url_for("cart"))

# ------------------------
# Place Order Route
# ------------------------
@app.route("/place_order", methods=["POST"])
@login_required
def place_order():
    cart = session.get("cart", [])

    if not cart:
        return "Cart is empty", 400

    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        # Calculate total amount using qty
        total_amount = sum(item.get("price", 0) * item.get("qty", 1) for item in cart)

        # Insert order and get ID (MySQL/PostgreSQL compatible)
        db_driver = conn.__class__.__module__
        if "psycopg2" in db_driver:  # PostgreSQL
            cursor.execute(
                "INSERT INTO orders (user_id, total_amount, created_at) VALUES (%s, %s, NOW()) RETURNING id",
                (current_user.id, total_amount)
            )
            order_id = cursor.fetchone()['id']
        else:  # MySQL
            cursor.execute(
                "INSERT INTO orders (user_id, total_amount, created_at) VALUES (%s, %s, NOW())",
                (current_user.id, total_amount)
            )
            conn.commit()
            order_id = cursor.lastrowid

        # Insert order items with subtotal
        for item in cart:
            qty = item.get("qty", 1)
            price = item.get("price", 0)
            subtotal = price * qty
            cursor.execute(
                "INSERT INTO order_items (order_id, product_name, price, qty, subtotal) VALUES (%s, %s, %s, %s, %s)",
                (order_id, item.get("name", "Unknown"), price, qty, subtotal)
            )

        conn.commit()
        cursor.close()
        conn.close()

        # Clear cart
        session["cart"] = []

        return redirect(url_for("my_orders"))

    except Exception as e:
        print("Error placing order:", str(e))
        return f"Error placing order: {str(e)}", 500


# ------------------------
# My Orders Route
# ------------------------
@app.route("/my-orders")
@login_required
def my_orders():
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        user_id = current_user.id

        # Fetch orders and items with status + tracking
        cursor.execute("""
            SELECT 
                o.id,
                o.total_amount,
                o.created_at,
                o.status,
                o.tracking_number,
                o.shipping_provider,
                i.product_name,
                i.price,
                i.qty AS quantity,
                (i.price * i.qty) AS subtotal
            FROM orders o
            LEFT JOIN order_items i ON o.id = i.order_id
            WHERE o.user_id = %s
            ORDER BY o.created_at DESC, i.id ASC
        """, (user_id,))

        rows = cursor.fetchall()

        # Organize data
        orders_dict = {}
        for row in rows:
            order_id = row["id"]
            if order_id not in orders_dict:
                orders_dict[order_id] = {
                    "id": order_id,
                    "total": row["total_amount"],
                    "created_at": row["created_at"],
                    "status": row["status"],
                    "tracking_number": row["tracking_number"],
                    "shipping_provider": row["shipping_provider"],
                    "order_items": []
                }
            if row["product_name"]:
                orders_dict[order_id]["order_items"].append({
                    "product_name": row["product_name"],
                    "price": row["price"],
                    "quantity": row["quantity"],
                    "subtotal": row["subtotal"]
                })

        orders = list(orders_dict.values())

        cursor.close()
        conn.close()

        return render_template("my_orders.html", orders=orders)

    except Exception as e:
        print("Error fetching orders:", str(e))
        return f"Error fetching orders: {str(e)}", 500

        return f"Error fetching orders: {str(e)}", 500



@app.route('/cart/update/<int:product_index>/<action>', methods=['POST'])
def update_cart(product_index, action):
    cart = session.get('cart', [])
    if 0 <= product_index < len(cart):
        if action == 'increase':
            cart[product_index]['qty'] += 1
        elif action == 'decrease' and cart[product_index]['qty'] > 1:
            cart[product_index]['qty'] -= 1
    session['cart'] = cart
    return redirect(url_for('cart'))

# ---------- Run ----------
if __name__ == "__main__":
    app.run(debug=True)
