import json
import sys

# Configure stdout to output UTF-8
sys.stdout.reconfigure(encoding='utf-8')

log_path = r"C:\Users\jordy\.gemini\antigravity\brain\1dfbb2a5-e4fa-434a-aea5-cbcf39c6d9b9\.system_generated\logs\transcript.jsonl"
steps = []
with open(log_path, 'r', encoding='utf-8') as f:
    for line in f:
        if line.strip():
            steps.append(json.loads(line))

print(f"Total steps: {len(steps)}")
print("\n--- LAST 10 STEPS ---")
for s in steps[-10:]:
    print(f"Step {s.get('step_index')} | Source: {s.get('source')} | Type: {s.get('type')} | Status: {s.get('status')}")
    content = s.get('content', '')
    if content:
        # truncate content for readability
        print(f"Content: {content[:300]}...")
    tool_calls = s.get('tool_calls', [])
    if tool_calls:
        print(f"Tool calls: {tool_calls}")
    print("-" * 40)
