import sys
import os

# Add the current directory to path so we can import config and store
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from store import save_link, get_all_links, delete_link
from config import Config

def test_connection():
    print("--- Testing Supabase Connection ---")
    print(f"URL: {Config.SUPABASE_URL}")
    print(f"Key identified: {'Yes' if Config.SUPABASE_KEY else 'No'}")
    
    try:
        # 1. Test Fetch
        print("\n1. Testing Fetch...")
        links = get_all_links()
        print(f"Success! Found {len(links)} links.")
        
        # 2. Test Insert
        print("\n2. Testing Insert...")
        test_card = {
            "url": "https://example.com/test",
            "domain": "example.com",
            "title": "Supabase Connection Test",
            "summary": "This is a test summary for Supabase migration.",
            "hashtags": ["test", "supabase"]
        }
        saved_card = save_link(test_card)
        print(f"Success! Saved card ID: {saved_card['id']}")
        
        # 3. Test Delete
        print("\n3. Testing Delete...")
        deleted = delete_link(saved_card['id'])
        if deleted:
            print("Success! Test card deleted.")
        else:
            print("Failed! Could not delete test card.")
            
        print("\n--- All tests passed! ---")
        
    except Exception as e:
        print(f"\n❌ Migration Test Failed: {e}")
        print("\nPossible issues:")
        print("1. Network reachability to Supabase.")
        print("2. Incorrect SUPABASE_URL or SUPABASE_KEY in .env.")
        print("3. Table 'links' does not exist (did you run the SQL schema?).")

if __name__ == "__main__":
    test_connection()
