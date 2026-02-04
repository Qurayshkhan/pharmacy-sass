<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ config('app.name') }}</title>

    <style>
        body {
            margin: 0;
            padding: 0;
            background-color: #f4f6f8;
            font-family: Arial, Helvetica, sans-serif;
        }

        .email-wrapper {
            width: 100%;
            padding: 40px 0;
        }

        .email-container {
            max-width: 600px;
            margin: auto;
            background: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
        }

        .email-header {
            background: linear-gradient(135deg, #4f46e5, #6366f1);
            padding: 20px;
            text-align: center;
            color: #ffffff;
            font-size: 22px;
            font-weight: bold;
        }

        .email-content {
            padding: 30px;
            color: #374151;
            font-size: 15px;
            line-height: 1.6;
        }

        .email-footer {
            background: #f9fafb;
            padding: 15px;
            text-align: center;
            font-size: 12px;
            color: #6b7280;
        }

        .btn {
            display: inline-block;
            margin-top: 20px;
            padding: 12px 22px;
            background: #4f46e5;
            color: #ffffff !important;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
        }
    </style>
</head>
<body>

<div class="email-wrapper">
    <div class="email-container">

        <div class="email-header">
            {{ config('app.name') }}
        </div>

        <div class="email-content">
            @yield('content')
        </div>

        <div class="email-footer">
            © {{ date('Y') }} {{ config('app.name') }}. All rights reserved.
        </div>

    </div>
</div>

</body>
</html>
