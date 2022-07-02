import psycopg2
import os
from config import config


def connect():
    """ Connect to the PostgreSQL database server """
    conn = None
    params = config()

    fd = open(os.path.dirname(__file__) + '/init.sql', 'r')
    sqlFile = fd.read()
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

        conn.commit()

        cur.close()
    except (Exception, psycopg2.DatabaseError) as error:
        print(error)
    finally:
        if conn is not None:
            conn.close()
            print('Database connection closed.')


if __name__ == '__main__':
    connect()
