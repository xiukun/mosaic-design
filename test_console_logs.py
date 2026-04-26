from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=False)
    page = browser.new_page()
    
    # 导航到应用页面
    page.goto('http://localhost:5173')
    
    # 等待页面加载完成
    page.wait_for_load_state('networkidle')
    
    # 捕获控制台日志
    console_logs = []
    def log_handler(message):
        console_logs.append({
            'type': message.type,
            'text': message.text,
            'url': message.location.url if message.location else None,
            'line': message.location.line if message.location else None,
            'column': message.location.column if message.location else None
        })
    
    page.on('console', log_handler)
    
    # 等待几秒钟，确保所有控制台消息都被捕获
    page.wait_for_timeout(3000)
    
    # 打印控制台日志
    print("Console Logs:")
    print("=" * 80)
    
    for log in console_logs:
        if log['type'] in ['error', 'warning']:
            print(f"[{log['type'].upper()}]")
            print(f"Text: {log['text']}")
            if log['url']:
                print(f"URL: {log['url']}")
                print(f"Line: {log['line']}, Column: {log['column']}")
            print("-" * 80)
    
    # 截图保存
    page.screenshot(path='test_screenshot.png', full_page=True)
    print("Screenshot saved as test_screenshot.png")
    
    browser.close()