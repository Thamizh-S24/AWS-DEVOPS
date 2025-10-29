from flask import Flask, render_template

app = Flask(__name__)

# Home page
@app.route("/")
def index():
    return render_template("index.html")

# Static pages
@app.route("/about")
def about():
    return render_template("about.html")

@app.route("/contact")
def contact():
    return render_template("contact.html")

@app.route("/blog")
def blog():
    return render_template("blog.html")

@app.route("/shop")
def shop():
    return render_template("shop.html")

# Craft categories
@app.route("/assorted-craft")
def assorted_craft():
    return render_template("assorted-craft.html")

@app.route("/blue-pottery")
def blue_pottery():
    return render_template("blue-pottery.html")

@app.route("/brass-craft")
def brass_craft():
    return render_template("brass-craft.html")

@app.route("/crystal-craft")
def crystal_craft():
    return render_template("crystal-craft.html")

@app.route("/furniture")
def furniture():
    return render_template("furniture.html")

@app.route("/marble-handicrafts")
def marble_handicrafts():
    return render_template("marble-handicrafts.html")

@app.route("/metal-craft")
def metal_craft():
    return render_template("metal-craft.html")

@app.route("/painting")
def painting():
    return render_template("painting.html")

@app.route("/wooden-handicrafts")
def wooden_handicrafts():
    return render_template("wooden-handicrafts.html")

# 404 error page
@app.errorhandler(404)
def page_not_found(e):
    return render_template("404.html"), 404

if __name__ == "__main__":
    app.run(debug=True)
