'use client';

import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Upload, 
  Image, 
  Video, 
  FileText,
  Palette,
  Music,
  Download,
  Search,
  Filter,
  Grid3X3,
  List,
  Plus,
  Loader2
} from 'lucide-react';

interface S3Asset {
  id: string;
  name: string;
  type: 'image' | 'video';
  size: number;
  format: string;
  lastModified: string;
  url: string;
  thumbnail?: string;
  tags: string[];
  formattedSize: string;
  createdAt: string;
}


export default function LibraryPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [assets, setAssets] = useState<S3Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [metadata, setMetadata] = useState<any>(null);

  useEffect(() => {
    fetchAssets();
  }, [selectedType, searchTerm]);

  const fetchAssets = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedType !== 'all') params.append('type', selectedType);
      if (searchTerm) params.append('search', searchTerm);
      
      const response = await fetch(`/api/s3-assets?${params.toString()}`);
      const result = await response.json();
      
      if (result.success) {
        setAssets(result.data);
        setMetadata(result.metadata);
      }
    } catch (error) {
      console.error('Error fetching assets:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <Image className="h-6 w-6" />;
      case 'video':
        return <Video className="h-6 w-6" />;
      default:
        return <FileText className="h-6 w-6" />;
    }
  };

  const assetTypes = ['all', 'image', 'video'];

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Asset Library</h1>
            <p className="text-gray-600">Manage and organize your S3 assets and creative resources</p>
            {metadata && (
              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                <span>{metadata.totalImages} Images</span>
                <span>{metadata.totalVideos} Videos</span>
                <span>Total: {metadata.total} assets</span>
                {metadata.usingS3 ? (
                  <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                    Live S3 Data
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-700 border-yellow-200">
                    Demo Data
                  </Badge>
                )}
              </div>
            )}
          </div>
          <div className="flex space-x-3">
            <Button variant="outline">
              <Upload className="mr-2 h-4 w-4" />
              Upload Asset
            </Button>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Template
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search assets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <Tabs value={selectedType} onValueChange={setSelectedType}>
              <TabsList>
                {assetTypes.map(type => (
                  <TabsTrigger key={type} value={type}>
                    {type === 'all' ? 'All' : type.charAt(0).toUpperCase() + type.slice(1)}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <span className="ml-2 text-gray-600">Loading assets...</span>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {assets.map((asset) => (
              <Card key={asset.id} className="group hover:shadow-lg transition-shadow cursor-pointer">
                <div className="relative aspect-video bg-gray-100 rounded-t-lg overflow-hidden">
                  {asset.thumbnail || asset.url ? (
                    <img 
                      src={asset.thumbnail || asset.url} 
                      alt={asset.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 opacity-10" />
                      <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                        {getTypeIcon(asset.type)}
                      </div>
                    </>
                  )}
                  <div className="absolute top-2 left-2">
                    <Badge variant="secondary" className="text-xs">
                      {asset.format}
                    </Badge>
                  </div>
                  <div className="absolute top-2 right-2">
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0 bg-white/80">
                      <Download className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-medium text-gray-900 text-sm group-hover:text-blue-600 transition-colors">
                        {asset.name}
                      </h3>
                      <div className="flex items-center justify-between mt-1">
                        <Badge variant="outline" className="text-xs">
                          {asset.type}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {asset.formattedSize}
                        </span>
                      </div>
                    </div>


                    <div className="flex flex-wrap gap-1">
                      {asset.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="text-xs text-gray-400">
                      {new Date(asset.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {assets.map((asset) => (
              <Card key={asset.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-10 bg-gray-100 rounded flex items-center justify-center text-gray-400">
                        {getTypeIcon(asset.type)}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{asset.name}</h3>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Badge variant="outline" className="text-xs">
                            {asset.type}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {asset.format}
                          </Badge>
                          <span className="text-xs text-gray-400">
                            {new Date(asset.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-8 text-sm">
                      <div className="text-center">
                        <div className="font-medium">{asset.formattedSize}</div>
                        <div className="text-gray-500 text-xs">Size</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium">{asset.type}</div>
                        <div className="text-gray-500 text-xs">Type</div>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {asset.tags.slice(0, 2).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!loading && assets.length === 0 && (
          <div className="text-center py-12">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No assets found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search or upload new assets.
            </p>
            <div className="mt-6">
              <Button>
                <Upload className="mr-2 h-4 w-4" />
                Upload Asset
              </Button>
            </div>
          </div>
        )}

      </div>
    </Layout>
  );
}