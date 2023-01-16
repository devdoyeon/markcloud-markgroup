import boto3
from io import BytesIO
import os
from crud import custom_error

import datetime

def get_s3_url(files, service_name):

    image_urls = []
    cnt = 0
    today = datetime.datetime.now().strftime('%Y%m%d%H%M%S')

    for file in files:
        c_type = file.content_type.split('/')[1]
        file = file.file.read()
        
        file = BytesIO(file)  
        # 타입확인하고

        key = f'{service_name}_{today}_{cnt}.{c_type}'
        bucket = upload_img_s3(file, key) # s3 이미지 업로드
        
        image_urls.append(f'https://{bucket}.s3.ap-northeast-2.amazonaws.com/{key}')
        cnt += 1

    image_url = ','.join(image_urls)
    return image_url


def upload_img_s3(file, key):
    
    try:
        AWS_ACCESS_KEY_ID = os.environ['AWS_ACCESS_KEY_ID']
        AWS_SECRET_ACCESS_KEY = os.environ['AWS_SECRET_ACCESS_KEY']
        # bucket = 'markcloud-groupware'
        AWS_BUCKET = os.environ['AWS_BUCKET']
        bucket = AWS_BUCKET
        
        s3_client = boto3.client(
                            's3',
                            aws_access_key_id=AWS_ACCESS_KEY_ID,
                            aws_secret_access_key=AWS_SECRET_ACCESS_KEY
    )       
        s3_client.upload_fileobj(file, bucket, key, ExtraArgs={'ACL': 'public-read'})
        print("--image uploaded--")
        return bucket
    
    except Exception:
        raise custom_error.S3ConnError