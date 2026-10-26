import csv
import json
import re
from pathlib import Path
from urllib.parse import urlparse

BASE_DIR = Path(__file__).resolve().parent
WEBSITES_CSV = BASE_DIR / 'websites.csv'
OUTPUT_JSON = BASE_DIR / 'opportunities.json'

GENERIC_SUFFIXES = {
    'volunteer', 'volunteers', 'volunteering', 'opportunities', 'opportunity',
    'directory', 'search', 'calendar', 'signup', 'portal', 'programs',
    'directory', 'directorys', 'events', 'website', 'websites', 'hub',
    'get-involved', 'program', 'programming', 'involvement'
}

ORGANIZATION_OVERRIDES = {
    'cityofpleasantonca.gov': 'City of Pleasanton',
    'trivalleyvolunteer.org': 'Tri-Valley Volunteer',
    'volunteerinfo.org': 'VolunteerInfo.org',
    'idealist.org': 'Idealist',
    'handsonbayarea.org': 'HandsOn Bay Area',
    'justserve.org': 'JustServe',
    'sanramon.ca.gov': 'City of San Ramon',
    'dublin.ca.gov': 'City of Dublin',
    'alamedacountyca.gov': 'Alameda County',
    'betterimpact.com': 'Pleasanton Public Library',
    'pleasantonpta.org': 'Pleasanton PTA',
    'trivalleyhaven.org': 'Tri-Valley Haven',
    'valleyhumane.org': 'Valley Humane Society',
    'stanfordhealthcare.org': 'Stanford Health Care',
    'larpd.org': 'Livermore Area Recreation and Park District',
    'kahbayarea.org': 'Kids Against Hunger Bay Area',
    'ebparks.org': 'East Bay Regional Park District',
    'pleasantondowntown.net': 'Pleasanton Downtown Association',
    'pleasantonlionsclub.org': 'Pleasanton Lions Club',
    'cityservecares.org': 'CityServe of the Tri-Valley',
    'catholicsofpleasanton.org': 'Catholic Community of Pleasanton',
    'tvar.org': 'Tri-Valley Animal Rescue',
    'spectrumcs.org': 'Spectrum Community Services',
    'openheartkitchen.org': 'Open Heart Kitchen',
    'accfb.org': 'Alameda County Community Food Bank',
    'foodbankccs.org': 'Food Bank of Contra Costa and Solano',
    '4calameda.org': '4Cs of Alameda County',
    'alamedaca.gov': 'City of Alameda',
    'alamedapost.com': 'Alameda Post',
    'alamedafoodbank.org': 'Alameda Food Bank',
    'slzhelp.org': 'San Lorenzo Family Help Center',
    'eastbayspca.org': 'East Bay SPCA',
}


def title_case(value):
    value = (value or '').strip()
    if not value:
        return ''
    words = re.split(r'[_\-\s]+', value)
    return ' '.join(part.capitalize() for part in words if part)


def normalize_title_phrase(value):
    text = re.sub(r'https?://|www\.|\.org|\.gov|\.ca|\.net|\.com', ' ', (value or '').lower())
    text = text.replace('&', ' and ')
    text = re.sub(r'[^a-z0-9\s]', ' ', text)
    text = re.sub(r'\s+', ' ', text).strip()
    text = ' '.join(word for word in text.split() if word not in GENERIC_SUFFIXES)
    return title_case(text) or 'Volunteer Opportunity'


def infer_organization_from_url(url):
    parsed = urlparse(url or '')
    host = parsed.netloc.lower().replace('www.', '')
    if not host:
        return 'Volunteer Opportunity'

    for key, value in ORGANIZATION_OVERRIDES.items():
        if key in host:
            return value

    host_name = host.split('.')[0]
    host_name = host_name.replace('-', ' ')
    host_name = re.sub(r'[^a-zA-Z0-9 ]', ' ', host_name)
    return title_case(host_name) or 'Volunteer Opportunity'


def infer_organization_from_name(name, url):
    source = (name or '').strip()
    if not source:
        return infer_organization_from_url(url)

    cleaned = source.lower()
    cleaned = cleaned.replace('volunteer', ' ')
    cleaned = cleaned.replace('volunteers', ' ')
    cleaned = cleaned.replace('volunteering', ' ')
    cleaned = cleaned.replace('opportunities', ' ')
    cleaned = cleaned.replace('opportunity', ' ')
    cleaned = cleaned.replace('directory', ' ')
    cleaned = cleaned.replace('search', ' ')
    cleaned = cleaned.replace('calendar', ' ')
    cleaned = cleaned.replace('portal', ' ')
    cleaned = cleaned.replace('signup', ' ')
    cleaned = cleaned.replace('programs', ' ')
    cleaned = cleaned.replace('program', ' ')
    cleaned = cleaned.replace('involvement', ' ')
    cleaned = re.sub(r'[^a-z0-9\s]', ' ', cleaned)
    cleaned = ' '.join(part for part in cleaned.split() if part)
    cleaned = cleaned.strip()

    if cleaned and len(cleaned.split()) >= 2:
        return title_case(cleaned)

    return infer_organization_from_url(url)


def build_title_and_org(website_name, url, notes, website_type, coverage_area):
    source_name = (website_name or '').strip()
    notes_text = (notes or '').strip().lower()
    combined = ' '.join(filter(None, [source_name, notes_text, website_type, coverage_area])).lower()

    if 'library' in combined or 'literacy' in combined or 'friend of the library' in combined:
        title = 'Library and Literacy Volunteer Support'
    elif 'tutoring' in combined or 'teacher' in combined or 'student virtual' in combined or 'learning support' in combined:
        title = 'Student Tutoring and Learning Support'
    elif 'garden' in combined or 'trail' in combined or 'park' in combined or 'restoration' in combined or 'cleanup' in combined or 'stewardship' in combined:
        title = 'Park and Trail Maintenance Support'
    elif 'animal' in combined or 'humane' in combined or 'shelter' in combined or 'pet care' in combined:
        title = 'Animal Care and Shelter Support'
    elif 'hospital' in combined or 'patient' in combined or 'health care' in combined or 'healthcare' in combined:
        title = 'Hospital and Patient Support'
    elif 'food pantry' in combined or 'meal' in combined or 'hunger' in combined or 'pantry' in combined or 'food recovery' in combined:
        title = 'Food Pantry and Meal Support'
    elif 'museum' in combined or 'history' in combined or 'docent' in combined or 'cultural' in combined:
        title = 'Museum and History Volunteer Support'
    elif 'teen' in combined or 'youth' in combined or 'leader' in combined or 'leadership' in combined or 'civic' in combined:
        title = 'Teen Leadership and Service Support'
    elif 'festival' in combined or 'event' in combined or 'concert' in combined:
        title = 'Community Event and Festival Support'
    elif 'family' in combined or 'donation' in combined or 'donate' in combined:
        title = 'Family Support and Donation Services'
    elif 'directory' in combined or 'search' in combined or 'calendar' in combined or 'portal' in combined or 'listing' in combined:
        if 'youth' in combined or 'teen' in combined:
            title = 'Youth Volunteer Matching and Referral'
        else:
            title = 'Volunteer Opportunity Matching and Referral'
    elif 'mobile pantry' in combined:
        title = 'Food Recovery and Pantry Support'
    else:
        title = 'Volunteer Support and Service Help'

    organization = infer_organization_from_name(source_name, url)

    if title == 'Volunteer Support and Service Help':
        title = 'Volunteer Opportunity Matching and Referral'

    if title.lower() == organization.lower():
        title = 'Community Service Support'

    return title, organization


def infer_age_range(website_name, notes, website_type, coverage_area):
    text = ' '.join(filter(None, [website_name, notes, website_type, coverage_area])).lower()
    if 'high school' in text or 'teen' in text or '15' in text or '16' in text:
        return 'High school students and teens'
    if 'grade 9' in text or '9th grade' in text:
        return 'Students in grades 9+' 
    if 'under 18' in text or 'parent account' in text:
        return 'Youth under 18 with guardian/parent involvement'
    if 'adult' in text:
        return 'Adults and mature teens'
    return 'Check age requirements'


def infer_schedule_and_time(website_name, notes, website_type, coverage_area):
    text = ' '.join(filter(None, [website_name, notes, website_type, coverage_area])).lower()
    if 'summer' in text:
        date = 'Seasonal (summer)'
    elif 'year-round' in text or 'ongoing' in text or 'continuous' in text:
        date = 'Ongoing'
    elif 'weekly' in text or 'shift' in text:
        date = 'Recurring weekly'
    else:
        date = 'Flexible'

    if 'evening' in text or 'night' in text:
        time = 'Evenings'
    elif 'weekday' in text or 'monday' in text or 'tuesday' in text or 'wednesday' in text or 'thursday' in text or 'friday' in text:
        time = 'Weekday shifts'
    elif 'saturday' in text or 'sunday' in text:
        time = 'Weekend shifts'
    else:
        time = 'Flexible'

    return date, time


def build_task_summary(website_name, notes, website_type, coverage_area):
    text = ' '.join(filter(None, [website_name, notes, website_type, coverage_area])).lower()

    tasks = []
    if 'library' in text or 'literacy' in text:
        tasks.extend(['helping with book sorting', 'supporting library programs and community outreach'])
    elif 'tutoring' in text or 'teacher' in text or 'student virtual' in text or 'learning' in text:
        tasks.extend(['supporting students with reading and homework help', 'assisting with virtual or in-person tutoring'])
    elif 'garden' in text or 'trail' in text or 'park' in text or 'restoration' in text or 'cleanup' in text or 'stewardship' in text:
        tasks.extend(['trail and park maintenance', 'environmental cleanup and habitat restoration'])
    elif 'animal' in text or 'humane' in text or 'shelter' in text or 'care' in text:
        tasks.extend(['animal care support', 'helping with shelter operations and adoption events'])
    elif 'hospital' in text or 'patient' in text or 'health care' in text:
        tasks.extend(['patient support and front desk assistance', 'helping with non-clinical care tasks'])
    elif 'food pantry' in text or 'meal' in text or 'hunger' in text or 'pantry' in text or 'food recovery' in text:
        tasks.extend(['food sorting and distribution', 'supporting pantry outreach and family meal programs'])
    elif 'museum' in text or 'history' in text or 'docent' in text:
        tasks.extend(['guided tours and visitor support', 'helping with exhibits and historical education'])
    elif 'festival' in text or 'event' in text or 'concert' in text:
        tasks.extend(['event setup and guest support', 'helping with logistics and community outreach'])
    elif 'family' in text or 'donation' in text or 'donate' in text:
        tasks.extend(['family support and donation services', 'assisting with outreach and program logistics'])
    else:
        tasks.extend(['community outreach and service support', 'helping with program operations and event logistics'])

    primary = tasks[0]
    secondary = tasks[1] if len(tasks) > 1 else 'supporting the organization’s mission'
    return primary, secondary


def build_description(title, organization, website_name, notes, website_type, coverage_area, url):
    location = (coverage_area or 'the local community').strip()
    primary_task, secondary_task = build_task_summary(website_name, notes, website_type, coverage_area)
    age_range = infer_age_range(website_name, notes, website_type, coverage_area)
    schedule, time = infer_schedule_and_time(website_name, notes, website_type, coverage_area)
    note_text = (notes or '').strip()

    detail = (
        f"Volunteer with {organization} to support {title.lower()}. This opportunity serves the {location} community and focuses on "
        f"{primary_task}. Volunteers may also help with {secondary_task}."
    )
    if age_range:
        detail += f" Typical volunteers should be eligible for {age_range}."
    detail += f" The role is generally scheduled as {schedule.lower()} with {time.lower()} availability."
    if note_text:
        detail += f" Please review the official listing for current openings, requirements, and application steps: {url}"
    else:
        detail += f" Please check the official site for current openings and application details: {url}"

    return detail


def normalize_category(value):
    category = (value or '').strip()
    aliases = {
        'Environment': 'Environment',
        'Education': 'Education',
        'Community': 'Community Service',
        'Community Service': 'Community Service',
        'Animals': 'Animal Care',
        'Animal Care': 'Animal Care',
        'Health': 'Health',
        'Healthcare': 'Health',
        'Technology': 'Technology',
        'Business': 'Business',
        'Food & Hunger': 'Community Service',
        'Food Insecurity': 'Community Service',
        'Civic': 'Community Service',
        'Youth directory': 'Education',
        'Local directory': 'Community Service',
        'Regional directory': 'Community Service',
        'City directory': 'Community Service',
        'City signup portal': 'Community Service',
        'Organization opportunities': 'Community Service',
        'Organization opportunity portal': 'Community Service',
        'Event calendar': 'Community Service',
    }
    return aliases.get(category, category or 'Community Service')


def build_opportunity(row):
    url = (row.get('website_url') or '').strip()
    website_name = (row.get('website_name') or '').strip()
    notes = (row.get('notes') or 'Check the official page for current openings, eligibility, and application requirements.').strip()
    title, organization = build_title_and_org(website_name, url, notes, row.get('website_type'), row.get('coverage_area'))
    age = infer_age_range(website_name, notes, row.get('website_type'), row.get('coverage_area'))
    schedule, time = infer_schedule_and_time(website_name, notes, row.get('website_type'), row.get('coverage_area'))
    description = build_description(title, organization, website_name, notes, row.get('website_type'), row.get('coverage_area'), url)
    category = normalize_category(row.get('website_type') or row.get('coverage_area') or 'Community Service')
    return {
        'id': abs(hash(title + url)),
        'title': title,
        'organization': organization,
        'description': description,
        'category': category,
        'date': schedule,
        'time': time,
        'age': age,
        'url': url,
        'liked': False,
        'saved': False,
    }


def main():
    opportunities = []
    if WEBSITES_CSV.exists():
        with WEBSITES_CSV.open(newline='', encoding='utf-8') as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                if not row.get('website_url'):
                    continue
                opportunities.append(build_opportunity(row))

    with OUTPUT_JSON.open('w', encoding='utf-8') as fh:
        json.dump(opportunities, fh, indent=2)

    print(f'Wrote {len(opportunities)} opportunities to {OUTPUT_JSON.name}')


if __name__ == '__main__':
    main()
