import xml.etree.ElementTree as ET
import json
import os

tree = ET.parse('target/pmd.xml')
root = tree.getroot()

# Namespace del PMD
ns = {'pmd': 'http://pmd.sourceforge.net/report/2.0.0'}

issues = []

for file in root.findall('pmd:file', ns):
    filepath = file.get('name')
    relative_path = os.path.relpath(filepath, start=os.getcwd())

    for violation in file.findall('pmd:violation', ns):
        issue = {
            "engineId": "pmd",
            "ruleId": violation.get('rule'),
            "primaryLocation": {
                "message": violation.text.strip(),
                "filePath": relative_path.replace("\\", "/"),
                "textRange": {
                    "startLine": int(violation.get('beginline')),
                    "endLine": int(violation.get('endline'))
                }
            },
            "type": "CODE_SMELL",
            "severity": "MINOR"
        }
        issues.append(issue)

with open('target/sonar-pmd-report.json', 'w') as f:
    json.dump({"issues": issues}, f, indent=2)
