import psycopg2
import os
import sys
from config import config


def connect(db, eval=False):
    """ Connect to the PostgreSQL database server """
    conn = None
    params = config(db)

    fd = open(os.path.dirname(__file__) + f'/init.sql', 'r')
    sqlFile = fd.read()
    fd.close()

    fd = open(os.path.dirname(__file__) + f'/eval.sql', 'r')
    evalFile = fd.read()
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

        if eval:
            for line in evalFile.split(';'):
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
        print("Resetting healthcare database...")
        connect('healthcare')
        exit(0)
    eval = '--eval' in sys.argv
    healthcare = '--healthcare' in sys.argv
    payment = '--payment' in sys.argv
    if healthcare:
        print("Resetting healthcare database" + (' with eval' if eval else '') + '...')
        connect('healthcare', eval)
        exit(0)
    if payment:
        print("Resetting payment database" + (' with eval' if eval else '') + '...')
        connect('payment', eval)
        exit(0)
    print('Command line arguments not recognized')
    exit(0)
