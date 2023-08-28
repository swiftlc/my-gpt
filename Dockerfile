# 使用官方的Nginx镜像作为基础镜像
FROM nginx:latest

# 将自定义的nginx.conf复制到容器中的/etc/nginx目录下
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 将本地的dist目录复制到容器中的指定位置
COPY dist /usr/share/nginx/html

# 暴露容器的80端口
EXPOSE 80

# 默认命令，启动Nginx服务
CMD ["nginx", "-g", "daemon off;"]
