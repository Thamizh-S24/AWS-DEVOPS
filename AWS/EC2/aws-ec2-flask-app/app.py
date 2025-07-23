from flask import Flask

app = Flask(__name__)

@app.route('/')
def homepage():
    return '''
    <html>
    <head>
        <title>Flask on EC2</title>
        <style>
            body {
                background-color: #f0f8ff;
                font-family: Arial, sans-serif;
                text-align: center;
                padding: 50px;
            }
            h1 {
                color: #333399;
            }
            p {
                font-size: 18px;
                color: #666666;
            }
            .btn {
                background-color: #4CAF50;
                color: white;
                padding: 10px 20px;
                text-decoration: none;
                border-radius: 5px;
                display: inline-block;
                margin-top: 20px;
            }
            .btn:hover {
                background-color: #45a049;
            }
        </style>
    </head>
    <body>
        <h1>🚀 Welcome to Your Flask App on EC2!</h1>
        <p>This is a live Flask application deployed on an AWS EC2 instance.</p>
        <a class="btn" href="https://aws.amazon.com/ec2/" target="_blank">Learn EC2</a>
    </body>
    </html>
    '''

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=80)
