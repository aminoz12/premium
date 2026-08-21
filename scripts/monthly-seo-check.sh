#!/bin/bash
# ============================================================================
# Monthly SEO Health Check - thefreeaitools.com
# Run: bash scripts/monthly-seo-check.sh
# ============================================================================

SITE="https://www.thefreeaitools.com"
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'
PASS="${GREEN}OK${NC}"
FAIL="${RED}FAIL${NC}"
WARN="${YELLOW}WARN${NC}"

echo ""
echo "============================================="
echo "  MONTHLY SEO AUDIT - $(date '+%B %Y')"
echo "  Site: $SITE"
echo "============================================="
echo ""

echo "1. Homepage HTTP status:"
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$SITE")
if [ "$STATUS" = "200" ]; then
  echo -e "   $PASS HTTP $STATUS"
else
  echo -e "   $FAIL HTTP $STATUS - homepage not accessible"
fi
echo ""

echo "2. robots.txt:"
ROBOTS_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$SITE/robots.txt")
if [ "$ROBOTS_STATUS" = "200" ]; then
  echo -e "   $PASS HTTP $ROBOTS_STATUS"
  DISALLOW_ROOT=$(curl -s "$SITE/robots.txt" | grep -c "Disallow: /$")
  if [ "$DISALLOW_ROOT" -gt 0 ]; then
    echo -e "   $FAIL Contains 'Disallow: /'"
  else
    echo -e "   $PASS No blanket Disallow found"
  fi
else
  echo -e "   $FAIL HTTP $ROBOTS_STATUS"
fi
echo ""

echo "3. Sitemap status:"
for SM in "sitemap.xml" "image-sitemap.xml" "videos-sitemap.xml" "tools/sitemap.xml" "categories/sitemap.xml" "blog/sitemap.xml" "embedded-tools/sitemap.xml"; do
  SM_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$SITE/$SM")
  if [ "$SM_STATUS" = "200" ]; then
    echo -e "   $PASS /$SM - HTTP $SM_STATUS"
  else
    echo -e "   $FAIL /$SM - HTTP $SM_STATUS"
  fi
done
echo "   Note: /embedded-tools/sitemap.xml is included for crawler discovery of embedded routes."
echo ""

echo "4. Homepage noindex check:"
NOINDEX_COUNT=$(curl -s "$SITE" | grep -ci "noindex")
if [ "$NOINDEX_COUNT" -gt 0 ]; then
  echo -e "   $FAIL Found 'noindex' $NOINDEX_COUNT time(s) in homepage HTML"
else
  echo -e "   $PASS No 'noindex' found in homepage HTML"
fi
echo ""

echo "5. X-Robots-Tag header:"
XROBOTS=$(curl -sI "$SITE" | grep -i "x-robots-tag" | head -1)
if echo "$XROBOTS" | grep -qi "noindex"; then
  echo -e "   $FAIL $XROBOTS"
else
  echo -e "   $PASS $XROBOTS"
fi
echo ""

echo "6. Canonical tag:"
CANONICAL=$(curl -s "$SITE" | grep -i "canonical" | head -1)
if [ -n "$CANONICAL" ]; then
  echo -e "   $PASS Canonical tag found"
else
  echo -e "   $WARN No canonical tag detected"
fi
echo ""

echo "7. Non-www redirect:"
REDIRECT=$(curl -sI "https://thefreeaitools.com" | grep -i "location" | head -1)
REDIRECT_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "https://thefreeaitools.com")
echo "   HTTP $REDIRECT_STATUS -> $REDIRECT"
if [ "$REDIRECT_STATUS" = "301" ] || [ "$REDIRECT_STATUS" = "308" ]; then
  echo -e "   $PASS Permanent redirect"
elif [ "$REDIRECT_STATUS" = "307" ] || [ "$REDIRECT_STATUS" = "302" ]; then
  echo -e "   $WARN Temporary redirect"
else
  echo -e "   $FAIL No redirect detected"
fi
echo ""

echo "8. Canonical tools inventory:"
TOOLS_HUB_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$SITE/tools")
echo -e "   /tools -> HTTP $TOOLS_HUB_STATUS"
TOOL_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$SITE/tools/password-generator")
echo -e "   /tools/password-generator -> HTTP $TOOL_STATUS"
TOOL_XROBOTS=$(curl -sI "$SITE/tools/password-generator" | grep -i "x-robots-tag" | head -1)
echo "   $TOOL_XROBOTS"
echo ""

echo "9. ads.txt:"
ADS_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$SITE/ads.txt")
if [ "$ADS_STATUS" = "200" ]; then
  echo -e "   $PASS HTTP $ADS_STATUS"
  echo "   Content: $(curl -s "$SITE/ads.txt")"
else
  echo -e "   $FAIL HTTP $ADS_STATUS"
fi
echo ""

echo "10. Time to First Byte (TTFB):"
TTFB=$(curl -s -o /dev/null -w "%{time_starttransfer}" "$SITE")
echo "   Homepage TTFB: ${TTFB}s"
TTFB_MS=$(echo "$TTFB * 1000" | bc 2>/dev/null || echo "unknown")
if [ "$TTFB_MS" != "unknown" ]; then
  TTFB_INT=${TTFB_MS%.*}
  if [ "$TTFB_INT" -lt 800 ]; then
    echo -e "   $PASS Good (< 800ms)"
  elif [ "$TTFB_INT" -lt 1800 ]; then
    echo -e "   $WARN Needs improvement (800ms-1800ms)"
  else
    echo -e "   $FAIL Poor (> 1800ms)"
  fi
fi
echo ""

echo "============================================="
echo "  AUDIT COMPLETE - $(date '+%Y-%m-%d %H:%M:%S')"
echo "============================================="
echo ""
echo "NEXT STEPS:"
echo "  1. Check Google Search Console"
echo "  2. Check Bing Webmaster Tools"
echo "  3. Fix any FAIL items immediately"
echo "  4. Monitor WARN items this month"
echo ""
