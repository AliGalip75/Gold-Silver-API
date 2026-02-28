import requests
from bs4 import BeautifulSoup
from .models import GoldPrice

def scrape_gold_prices():
    # Target URL for gold prices
    url = "https://bigpara.hurriyet.com.tr/altin/"

    # Headers to bypass bot protection
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
    }

    try:
        # Fetch HTML content
        print("STEP 1: Requesting Bigpara...")
        response = requests.get(url, headers=headers, timeout=10)

        print(f"STEP 2: Bigpara responded with {response.status_code}")
        soup = BeautifulSoup(response.content, 'html.parser')

        # Select the ul tags inside the table container
        rows = soup.select(".tableCnt .tBody ul")

        for row in rows:
            name_element = row.select_one(".cell010")
            price_elements = row.select(".cell009") 
            
            if not name_element or len(price_elements) < 2:
                continue

            # Get exact name and convert to uppercase
            name = name_element.text.strip().upper()
            
            # Exact mapping
            gold_type = None
            if name == "ALTIN (TL/GR)":
                gold_type = "gram"
            elif name == "ÇEYREK ALTIN":
                gold_type = "ceyrek"
            elif name == "YARIM ALTIN":
                gold_type = "yarim"
            elif name == "CUMHURIYET ALTINI":
                gold_type = "tam"
            elif name == "GÜMÜŞ (TL/GR)":
                gold_type = "gumus"
                
            if gold_type:
                # Clean string and convert to float
                buy_str = price_elements[0].text.strip().replace('.', '').replace(',', '.')
                sell_str = price_elements[1].text.strip().replace('.', '').replace(',', '.')
                print("STEP 3: Parsing done. Connecting to Neon DB...")
                try:
                    # Save record to the database
                    GoldPrice.objects.create(
                        gold_type=gold_type,
                        price_buy=float(buy_str),
                        price_sell=float(sell_str)
                    )
                    print("STEP 4: Saved to database successfully.")
                except ValueError:
                    pass
                    
    except Exception as e:
        # Log error
        print(f"Scraping failed: {e}")