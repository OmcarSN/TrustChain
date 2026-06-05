import re

files = [r'contracts\credential\src\lib.rs', r'contracts\reputation\src\lib.rs']

for file in files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    topics = {}
    for line in content.splitlines():
        match = re.search(r'const\s+(TOPIC_\w+):\s*symbol_short\s*=\s*symbol_short!\("([^"]+)"\);', line)
        if match:
            topics[match.group(1)] = match.group(2)
            
    content = re.sub(r'const\s+TOPIC_\w+:\s*symbol_short\s*=\s*symbol_short!\("[^"]+"\);\n?', '', content)
    
    for topic, val in topics.items():
        content = content.replace(topic, f'Symbol::new(&env, "{val}")')
        
    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)
