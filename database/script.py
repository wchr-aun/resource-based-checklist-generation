import psycopg2
import os
import sys
from config import config


def connect(db):
    """ Connect to the PostgreSQL database server """
    conn = None
    params = config(db)

    fd = open(os.path.dirname(__file__) + f'/init.sql', 'r')
    sqlFile = fd.read()
    fd.close()

    fd = open(os.path.dirname(__file__) + f'/{db}.sql', 'r')
    contextSqlFile = fd.read()
    fd.close()

    try:
        print('Connecting to the PostgreSQL database...')
        conn = psycopg2.connect(**params)
        conn.autocommit = True

        cur = conn.cursor()

        for line in sqlFile.split(';'):
            if not line:
                continue
            cur.execute(line)

        for line in contextSqlFile.split(';'):
            if not line:
                continue
            cur.execute(line)

        conn.commit()
        cur.close()
    except (Exception, psycopg2.DatabaseError) as error:
        print(error)
    finally:
        if conn is not None:
            conn.close()
            print('Database connection closed.')


if __name__ == '__main__':
    if len(sys.argv) == 1:
        connect('healthcare')
        exit(0)
    db = sys.argv[1] or 'healthcare'
    if db != 'healthcare' and db != 'payment':
        exit(0)
    connect(db)
