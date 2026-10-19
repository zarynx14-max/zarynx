from html.parser import HTMLParser
import re
class TP(HTMLParser):
    def __init__(self):
        super().__init__(); self.tables=[]; self.cur=None; self.row=None; self.cell=None; self.depth=0
    def handle_starttag(self,t,a):
        if t=='table': self.cur=[]; self.tables.append(self.cur)
        elif t=='tr' and self.cur is not None: self.row=[]; self.cur.append(self.row)
        elif t in('td','th') and self.row is not None: self.cell=[]
        elif t=='br' and self.cell is not None: self.cell.append(' ')
        elif t=='img' and self.cell is not None:
            d=dict(a); self.cell.append('')  # ignore images
    def handle_endtag(self,t):
        if t in('td','th') and self.cell is not None:
            self.row.append(re.sub(r'\s+',' ',''.join(self.cell)).strip()); self.cell=None
        elif t=='tr': self.row=None
        elif t=='table': self.cur=None
    def handle_data(self,d):
        if self.cell is not None: self.cell.append(d)
def tables(path):
    p=TP(); p.feed(open(path,encoding='utf-8',errors='ignore').read()); return p.tables
