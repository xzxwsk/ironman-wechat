#!/usr/bin/env python3
import sys
import shutil
import os
import os.path

def readfile(filename, openstyle="r+"):
    file = open(filename, openstyle, encoding='UTF-8')
    size = 209715200
    lines = file.readlines()
    for line in lines:
        #print(line)
        if 'routerBase' in line and '=' in line:
            x = (line.split('=')[1])
            print('routerBase =', x)
            break
    return x

len = len(sys.argv)
if len != 2:
    exit()
str = sys.argv[1]
print('*'*10,'请在 local test prod 3个模式中选择一个，并在命令中附带上','*'*10,)
if not (str == 'local' or str == 'prod' or str == 'test') :
    print('*'*20,'模式选择错误！！！','*'*20)
    exit()

src = os.path.abspath('.')
dist = '%s/src/common/config.js' % src
if str == 'local':
    dir = '%s/webConfig/config_location.js' % src
    if not os.path.exists(dir):
        exit()
    shutil.copyfile(dir,dist)
    print('*'*20,'当前运行 本地 local 模式','*'*20)
    os.system('npm run dev')
elif str == 'test':
    dir = '%s/webConfig/config_test.js' % src
    if not os.path.exists(dir):
        exit()
    shutil.copyfile(dir,dist)
    print('*'*20,'当前运行测试服务器test模式','*'*20)
    command = 'npm run build '+ readfile(dist).replace('\'', '')
    os.system(command)
    userIp = 'root@192.168.31.9'
    relativePath = '/mnt/data/ironman/webapps/wechat'
    uploadToServer = 'scp -r %s/dist/* %s:%s' % (src,userIp,relativePath)
    #uploadToServer = 'scp -r %s/dist/* root@192.168.31.9:/mnt/data/ironman/webapps/wechat' % src
    print(uploadToServer)
    print('密码：\npisendev_web_9_2017')
    os.system(uploadToServer)
elif str == 'prod':
    dir = '%s/webConfig/config_product.js' % src
    if not os.path.exists(dir):
        exit()
    shutil.copyfile(dir,dist)
    print('*'*20,'当前运行 正式服务器 prod 模式','*'*20)
    command ='npm run build '+ readfile(dist).replace('\'', '')
    os.system(command)
    userIp = 'remote@121.196.236.199'
    relativePath = '/mnt/data/web/ironman/webapps/wechat'
    uploadToServer = 'scp -r -P 99 %s/dist/* %s:%s' % (src,userIp,relativePath)
    #uploadToServer = 'scp -r -P 99 %s/dist/* remote@121.196.236.199:/mnt/data/web/ironman/webapps/wechat' % src
    print(uploadToServer)
    print('密码：\n13PiSEn/*-@V2#|*/12i-23d%7uxuqg911!277')
    os.system(uploadToServer)
