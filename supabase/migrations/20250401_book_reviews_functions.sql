
-- Function to check if a user has purchased a book
CREATE OR REPLACE FUNCTION check_book_purchase(p_book_id UUID, p_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM book_purchases
    WHERE book_id = p_book_id AND user_id = p_user_id
  );
END;
$$;

-- Function to create a book purchase
CREATE OR REPLACE FUNCTION create_book_purchase(p_book_id UUID, p_user_id UUID, p_amount NUMERIC, p_currency TEXT DEFAULT 'EGP')
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO book_purchases (book_id, user_id, amount, currency)
  VALUES (p_book_id, p_user_id, p_amount, p_currency);
END;
$$;

-- Function to create a book review
CREATE OR REPLACE FUNCTION create_book_review(p_book_id UUID, p_user_id UUID, p_rating INTEGER, p_review_text TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO book_reviews (book_id, user_id, rating, review_text)
  VALUES (p_book_id, p_user_id, p_rating, p_review_text);
END;
$$;

-- Function to get book reviews
CREATE OR REPLACE FUNCTION get_book_reviews(p_book_id UUID)
RETURNS TABLE (
  id UUID,
  book_id UUID,
  user_id UUID,
  rating INTEGER,
  review_text TEXT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT br.id, br.book_id, br.user_id, br.rating, br.review_text, br.created_at, br.updated_at
  FROM book_reviews br
  WHERE br.book_id = p_book_id
  ORDER BY br.created_at DESC;
END;
$$;

-- Function to get book rating statistics
CREATE OR REPLACE FUNCTION get_book_rating(p_book_id UUID)
RETURNS TABLE (
  average_rating NUMERIC,
  reviews_count INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(AVG(rating), 0)::NUMERIC AS average_rating,
    COUNT(*)::INTEGER AS reviews_count
  FROM book_reviews
  WHERE book_id = p_book_id;
END;
$$;

-- Function to get recommended books
CREATE OR REPLACE FUNCTION get_recommended_books(p_book_id UUID, p_limit INTEGER DEFAULT 4)
RETURNS TABLE (
  id UUID,
  title TEXT,
  author TEXT,
  cover_url TEXT,
  price NUMERIC,
  currency TEXT,
  pages INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- First try to get recommendations from the book_recommendations table
  RETURN QUERY
  SELECT 
    b.id, 
    b.title, 
    b.author, 
    b.cover_url, 
    b.price, 
    b.currency, 
    b.pages
  FROM book_recommendations br
  JOIN books b ON b.id = br.recommended_book_id
  WHERE br.book_id = p_book_id
  ORDER BY br.weight DESC
  LIMIT p_limit;
  
  -- If no rows returned, get recommendations based on category
  IF NOT FOUND THEN
    RETURN QUERY
    SELECT 
      b.id, 
      b.title, 
      b.author, 
      b.cover_url, 
      b.price, 
      b.currency, 
      b.pages
    FROM books b
    WHERE b.id != p_book_id
    AND b.status = 'published'
    AND b.category = (SELECT category FROM books WHERE id = p_book_id)
    ORDER BY b.created_at DESC
    LIMIT p_limit;
  END IF;
  
  -- If still no rows, just get the latest books
  IF NOT FOUND THEN
    RETURN QUERY
    SELECT 
      b.id, 
      b.title, 
      b.author, 
      b.cover_url, 
      b.price, 
      b.currency, 
      b.pages
    FROM books b
    WHERE b.id != p_book_id
    AND b.status = 'published'
    ORDER BY b.created_at DESC
    LIMIT p_limit;
  END IF;
END;
$$;
